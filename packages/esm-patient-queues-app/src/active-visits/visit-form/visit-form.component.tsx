import {
  Button,
  ButtonSet,
  ContentSwitcher,
  Dropdown,
  Form,
  Layer,
  Select,
  SelectItem,
  Stack,
  Switch,
  TextArea,
} from '@carbon/react';
import {
  showNotification,
  showToast,
  toDateObjectStrict,
  toOmrsIsoString,
  useLayoutType,
  useSession,
  useVisitTypes,
} from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './visit-form.scss';
import { NewVisitPayload } from '../../types';
import { amPm, convertTime12to24 } from '../../helpers/time-helpers';
import { useQueueRoomLocations } from '../../hooks/useQueueRooms';
import { addQueueEntry } from '../active-visits-table.resource';
import Overlay from '../../overlay.component';
import { createVisit, useProviders } from '../patient-queues.resource';

interface VisitFormProps {
  patientUuid: string;
  closePanel: () => void;
  header : string
}

const StartVisitForm: React.FC<VisitFormProps> = ({ patientUuid, closePanel, header }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const sessionUser = useSession();
  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeFormat, setTimeFormat] = useState<amPm>(new Date().getHours() >= 12 ? 'PM' : 'AM');
  const [visitDate, setVisitDate] = useState(new Date());
  const [visitTime, setVisitTime] = useState(dayjs(new Date()).format('hh:mm'));
  const allVisitTypes = useVisitTypes();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [visitType, setVisitType] = useState('');
  const [priorityComment, setPriorityComment] = useState('');
  const priorityLevels = [1, 2, 3];
  const { providers } = useProviders();
  const { queueRoomLocations, mutate } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);
  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');

  useEffect(() => {
    if (queueRoomLocations?.length && sessionUser) {
      setSelectedLocation(sessionUser?.sessionLocation?.display);
      setVisitType(allVisitTypes?.length > 0 ? allVisitTypes[0].uuid : null);
    }
  }, [sessionUser, queueRoomLocations?.length, queueRoomLocations, allVisitTypes]);

  useMemo(() => {
    switch (contentSwitcherIndex) {
      case 0: {
        setPriorityComment('Not Urgent');
        break;
      }
      case 1: {
        setPriorityComment('Urgent');
        break;
      }
      case 2: {
        setPriorityComment('Emergency');
        break;
      }
    }
  }, [contentSwitcherIndex]);

  const filteredlocations = queueRoomLocations?.filter((location) => location.uuid != null);

  const filteredProviders = providers?.flatMap((provider) =>
    provider.attributes.filter(
      (item) =>
        item.attributeType.display === 'Default Location' &&
        typeof item.value === 'object' &&
        item?.value?.uuid === selectedNextQueueLocation,
    ).length > 0
      ? provider
      : [],
  );

  // Check if selectedNextQueueLocation has a value selected
  const isFormValid = selectedNextQueueLocation;

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        // Retrieve values from queue extension
        const nextQueueLocationUuid = event?.target['nextQueueLocation']?.value;
        const status = 'pending';
        const comment = event?.target['nextNotes']?.value;

        const [hours, minutes] = convertTime12to24(visitTime, timeFormat);

        const payload: NewVisitPayload = {
          patient: patientUuid,
          startDatetime: toDateObjectStrict(
            toOmrsIsoString(
              new Date(dayjs(visitDate).year(), dayjs(visitDate).month(), dayjs(visitDate).date(), hours, minutes),
            ),
          ),
          visitType: visitType,
          location: selectedNextQueueLocation,
          attributes: [],
        };

        // // Attempt to save the visit
        const response = await createVisit(payload);
        if (response.status === 201) {
          // Add new queue entry if visit was created successfully
          const queueResponse = await addQueueEntry(
            nextQueueLocationUuid,
            patientUuid,
            selectedProvider,
            contentSwitcherIndex,
            status,
            selectedLocation,
            priorityComment,
            comment,
          );

          if (queueResponse.status === 201) {
            showToast({
              kind: 'success',
              title: t('startVisit', 'Start a visit'),
              description: t(
                'startVisitQueueSuccessfully',
                'Patient has been added to active visits list and queue.',
                `${hours} : ${minutes}`,
              ),
            });
            closePanel();
            mutate();
          }
        }
      } catch (error) {
        console.log('error', error);
        showNotification({
          title: t('startVisitError', 'Error starting visit'),
          kind: 'error',
          critical: true,
          description: error?.message || t('unexpectedError', 'An unexpected error occurred'),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      closePanel,
      contentSwitcherIndex,
      mutate,
      patientUuid,
      priorityComment,
      selectedLocation,
      selectedNextQueueLocation,
      selectedProvider,
      t,
      timeFormat,
      visitDate,
      visitTime,
      visitType,
    ],
  );

  return (
    <div>
      <Overlay closePanel={() => closePanel} header={header}>
        <Form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <Stack gap={8} className={styles.container}>
              <section className={styles.section}>
                <div className={styles.sectionTitle}>{t('priority', 'Priority')}</div>
                <ContentSwitcher
                  selectedIndex={contentSwitcherIndex}
                  className={styles.contentSwitcher}
                  onChange={({ index }) => setContentSwitcherIndex(index)}
                >
                  <Switch name="notUrgent" text={t('notUrgent', 'Not Urgent')} />
                  <Switch name="urgent" text={t('urgent', 'Urgent')} />
                  <Switch name="emergency" text={t('emergency', 'Emergency')} />
                </ContentSwitcher>
              </section>
              <section className={styles.section}>
                {contentSwitcherIndex !== 0 && (
                  <Dropdown
                    id="priority-levels"
                    titleText="Choose Priority Level"
                    label="Select a priority level"
                    items={priorityLevels}
                    itemToString={(item) => (item ? String(item) : '')}
                  />
                )}
              </section>

              <section className={styles.section}>
                <TextArea
                  labelText={t('notes', 'Enter notes ')}
                  id="nextNotes"
                  name="nextNotes"
                  invalidText="Required"
                  helperText="Please enter notes"
                  maxCount={500}
                  enableCounter
                />
              </section>

              <section className={styles.section}>
                <div className={styles.sectionTitle}>{t('nextServicePoint', 'Next Service Point')}</div>
                <ResponsiveWrapper isTablet={isTablet}>
                  <Select
                    labelText={t('selectNextServicePoint', 'Select next service point')}
                    id="nextQueueLocation"
                    name="nextQueueLocation"
                    invalidText="Required"
                    value={selectedNextQueueLocation}
                    onChange={(event) => setSelectedNextQueueLocation(event.target.value)}
                  >
                    {!selectedNextQueueLocation ? (
                      <SelectItem text={t('selectNextServicePoint', 'Select next service point')} value="" />
                    ) : null}
                    {filteredlocations.map((location) => (
                      <SelectItem key={location.uuid} text={location.display} value={location.uuid}>
                        {location.display}
                      </SelectItem>
                    ))}
                  </Select>
                </ResponsiveWrapper>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionTitle}>{t('selectAProvider', 'Select a provider')}</div>
                <ResponsiveWrapper isTablet={isTablet}>
                  <Select
                    labelText={t('selectProvider', 'Select a provider')}
                    id="providers-list"
                    name="providers-list"
                    invalidText="Required"
                    value={selectedProvider}
                    onChange={(event) => setSelectedProvider(event.target.value)}
                  >
                    {!selectedProvider ? <SelectItem text={t('selectProvider', 'Select a provider')} value="" /> : null}
                    {filteredProviders.map((provider) => (
                      <SelectItem key={provider.uuid} text={provider.display} value={provider.uuid}>
                        {provider.display}
                      </SelectItem>
                    ))}
                  </Select>
                </ResponsiveWrapper>
              </section>
            </Stack>
          </div>
          <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
            <Button className={styles.button} kind="secondary" onClick={closePanel}>
              {t('discard', 'Discard')}
            </Button>
            <Button className={styles.button} disabled={!isFormValid || isSubmitting} kind="primary" type="submit">
              {t('startVisit', 'Start visit')}
            </Button>
          </ButtonSet>
        </Form>
      </Overlay>
    </div>
  );
};

function ResponsiveWrapper({ children, isTablet }) {
  return isTablet ? <Layer>{children}</Layer> : <div>{children}</div>;
}

export default StartVisitForm;
