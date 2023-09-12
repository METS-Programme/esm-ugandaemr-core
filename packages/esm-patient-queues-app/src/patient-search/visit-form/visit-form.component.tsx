import {
  Button,
  ButtonSet,
  ContentSwitcher,
  Dropdown,
  Form,
  Layer,
  Row,
  Select,
  SelectItem,
  Stack,
  Switch,
  TextArea,
} from '@carbon/react';
import {
  ConfigObject,
  ExtensionSlot,
  saveVisit,
  showNotification,
  showToast,
  toDateObjectStrict,
  toOmrsIsoString,
  useConfig,
  useLayoutType,
  useLocations,
  useSession,
  useVisitTypes,
} from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import isEmpty from 'lodash-es/isEmpty';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { first } from 'rxjs/operators';
import { addQueueEntry, useVisitQueueEntries } from '../../active-visits/active-visits-table.resource';
import { amPm, convertTime12to24 } from '../../helpers/time-helpers';
import { useQueueLocations } from '../../patient-search/hooks/useQueueLocations';
import { NewVisitPayload, PatientProgram, SearchTypes } from '../../types';
import { useActivePatientEnrollment } from '../hooks/useActivePatientEnrollment';
import { useDefaultLoginLocation } from '../hooks/useDefaultLocation';
import { useQueueRoomLocations } from '../hooks/useQueueRooms';
import styles from './visit-form.scss';
interface VisitFormProps {
  toggleSearchType: (searchMode: SearchTypes, patientUuid) => void;
  patientUuid: string;
  closePanel: () => void;
  mode: boolean;
}

const StartVisitForm: React.FC<VisitFormProps> = ({ patientUuid, toggleSearchType, closePanel, mode }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const locations = useLocations();
  const sessionUser = useSession();

  const config = useConfig() as ConfigObject;
  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(0);
  const [isMissingVisitType, setIsMissingVisitType] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeFormat, setTimeFormat] = useState<amPm>(new Date().getHours() >= 12 ? 'PM' : 'AM');
  const [visitDate, setVisitDate] = useState(new Date());
  const [visitTime, setVisitTime] = useState(dayjs(new Date()).format('hh:mm'));
  const state = useMemo(() => ({ patientUuid }), [patientUuid]);
  const allVisitTypes = useVisitTypes();
  const [ignoreChanges, setIgnoreChanges] = useState(true);
  const { activePatientEnrollment, isLoading } = useActivePatientEnrollment(patientUuid);
  const [enrollment, setEnrollment] = useState<PatientProgram>(activePatientEnrollment[0]);
  const { mutate } = useVisitQueueEntries('', '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [visitType, setVisitType] = useState('');
  const [priorityComment, setPriorityComment] = useState('');
  const priorityLevels = [1, 2, 3];
  const [priorityLevel, setPriorityLevel] = useState();

  const { queueRoomLocations } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState('');

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

  const filteredlocations = queueRoomLocations?.filter((location) => location.display != selectedLocation);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      // retrieve values from queue extension
      const nextQueueLocationUuid = event?.target['nextQueueLocation']?.value;
      const status = 'pending';
      const level = event?.target['priority-levels']?.value;
      const comment = event?.target['nextNotes']?.value;

      if (!visitType) {
        setIsMissingVisitType(true);
        return;
      }

      setIsSubmitting(true);

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

      const abortController = new AbortController();

      saveVisit(payload, abortController)
        .pipe(first())
        .subscribe(
          (response) => {
            if (response.status === 201) {
              // add new queue entry if visit created successfully
              addQueueEntry(
                response.data.uuid,
                nextQueueLocationUuid,
                patientUuid,
                contentSwitcherIndex,
                status,
                selectedLocation,
                priorityComment,
                comment,
              ).then(
                ({ status }) => {
                  if (status === 201) {
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
                },
                (error) => {
                  showNotification({
                    title: t('queueEntryError', 'Error adding patient to the queue'),
                    kind: 'error',
                    critical: true,
                    description: error?.message,
                  });
                },
              );
            }
          },
          (error) => {
            showNotification({
              title: t('startVisitError', 'Error starting visit'),
              kind: 'error',
              critical: true,
              description: error?.message,
            });
          },
        );
    },
    [
      closePanel,
      contentSwitcherIndex,
      mutate,
      patientUuid,
      priorityComment,
      selectedLocation,
      selectedNextQueueLocation,
      t,
      timeFormat,
      visitDate,
      visitTime,
      visitType,
    ],
  );

  const handleOnChange = () => {
    setIgnoreChanges((prevState) => !prevState);
  };

  return (
    <Form className={styles.form} onChange={handleOnChange} onSubmit={handleSubmit}>
      <div>
        {isTablet && (
          <Row className={styles.headerGridRow}>
            <ExtensionSlot name="visit-form-header-slot" className={styles.dataGridRow} state={state} />
          </Row>
        )}

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
            <Dropdown
              id="priority-levels"
              titleText="Choose Priority Level"
              label="select a priority Level"
              items={priorityLevels}
              itemToString={(priorityLevels) => (priorityLevels ? priorityLevels : 0)}
            />
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
        </Stack>
      </div>
      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button className={styles.button} kind="secondary" onClick={closePanel}>
          {t('discard', 'Discard')}
        </Button>
        <Button className={styles.button} disabled={isSubmitting} kind="primary" type="submit">
          {t('startVisit', 'Start visit')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

function ResponsiveWrapper({ children, isTablet }) {
  return isTablet ? <Layer>{children}</Layer> : <div>{children}</div>;
}

export default StartVisitForm;
