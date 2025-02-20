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
  InlineLoading,
  InlineNotification,
} from '@carbon/react';
import {
  ExtensionSlot,
  restBaseUrl,
  showNotification,
  showToast,
  toDateObjectStrict,
  toOmrsIsoString,
  useLayoutType,
  usePatient,
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
import Overlay from '../overlay/overlay.component';
import {
  NewQueuePayload,
  addQueueEntry,
  checkCurrentVisit,
  createVisit,
  useProviders,
} from '../../active-visits/patient-queues.resource';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateQueueEntryFormData,
  createQueueEntrySchema,
} from '../../active-visits/patient-queue-validation-schema.resource';
import { QueueStatus, handleMutate } from '../../utils/utils';

interface VisitFormProps {
  patientUuid: string;
  closePanel: () => void;
  header: string;
}

const StartVisitForm: React.FC<VisitFormProps> = ({ patientUuid, closePanel, header }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const sessionUser = useSession();
  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(0);
  const { patient } = usePatient(patientUuid);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeFormat, setTimeFormat] = useState<amPm>(new Date().getHours() >= 12 ? 'PM' : 'AM');
  const [visitDate, setVisitDate] = useState(new Date());
  const [visitTime, setVisitTime] = useState(dayjs(new Date()).format('hh:mm'));
  const allVisitTypes = useVisitTypes();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [visitType, setVisitType] = useState('');
  const [priorityComment, setPriorityComment] = useState('');
  const priorityLevels = [1, 2, 3];
  const { queueRoomLocations, error: errorLoadingQueueRooms } = useQueueRoomLocations(
    sessionUser?.sessionLocation?.uuid,
  );
  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const priorityLabels = useMemo(() => ['Not Urgent', 'Urgent', 'Emergency'], []);

  const { providers, error: errorLoadingProviders } = useProviders(selectedNextQueueLocation);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQueueEntryFormData>({
    mode: 'all',
    defaultValues: {
      comment: 'NA',
    },
    resolver: zodResolver(createQueueEntrySchema),
  });

  useEffect(() => {
    setPriorityComment(priorityLabels[contentSwitcherIndex]);
  }, [contentSwitcherIndex, priorityLabels]);

  useEffect(() => {
    if (queueRoomLocations?.length && sessionUser) {
      setSelectedLocation(sessionUser?.sessionLocation?.display);
      setVisitType(allVisitTypes?.length > 0 ? allVisitTypes[0].uuid : null);
    }
  }, [sessionUser, queueRoomLocations?.length, queueRoomLocations, allVisitTypes]);

  const onSubmit = useCallback(
    async (event) => {
      setIsSubmitting(true);

      try {
        // Check for an existing visit before proceeding
        const existingVisit = await checkCurrentVisit(patientUuid);

        if (existingVisit) {
          showNotification({
            title: t('visitExists', 'Visit already exists'),
            kind: 'info',
            description: t('activeVisitExists', 'An active visit already exists for this patient.'),
          });
          return;
        }

        const [hours, minutes] = convertTime12to24(visitTime, timeFormat);

        const payload: NewVisitPayload = {
          patient: patientUuid,
          startDatetime: toDateObjectStrict(
            toOmrsIsoString(
              new Date(dayjs(visitDate).year(), dayjs(visitDate).month(), dayjs(visitDate).date(), hours, minutes),
            ),
          ),
          visitType,
          location: selectedNextQueueLocation,
          attributes: [],
        };

        // Attempt to save the visit
        const response = await createVisit(payload);

        if (response.status !== 201) {
          throw new Error(t('visitCreationFailed', 'Failed to create visit.'));
        }

        // Add new queue entry
        const request: NewQueuePayload = {
          patient: patientUuid,
          provider: selectedProvider,
          locationFrom: sessionUser?.sessionLocation?.uuid,
          locationTo: selectedNextQueueLocation,
          status: QueueStatus.Pending,
          priority: contentSwitcherIndex,
          priorityComment: priorityComment,
          comment: 'NA',
          queueRoom: selectedNextQueueLocation,
        };

        const createQueueResponse = await addQueueEntry(request);

        if (createQueueResponse.status === 201) {
          showToast({
            kind: 'success',
            title: t('startVisit', 'Start a visit'),
            description: t('startVisitQueueSuccessfully', 'Patient has been added to active visits list and queue.'),
          });

          handleMutate(`${restBaseUrl}/patientqueue`);
          closePanel();
        }
      } catch (error) {
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
      <Overlay closePanel={closePanel} header={header}>
        {patient && (
          <ExtensionSlot
            name="patient-header-slot"
            state={{
              patient,
              patientUuid: patientUuid,
              hideActionsOverflow: true,
            }}
          />
        )}
        <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Stack gap={8} className={styles.container}>
              <section className={styles.section}>
                <div className={styles.sectionTitle}>{t('priority', 'Priority')}</div>
                <Controller
                  name="priorityComment"
                  control={control}
                  render={({ field }) => (
                    <ContentSwitcher
                      {...field}
                      selectedIndex={contentSwitcherIndex}
                      className={styles.contentSwitcher}
                      onChange={({ index }) => {
                        field.onChange(index);
                        setContentSwitcherIndex(index);
                      }}
                    >
                      {priorityLabels.map((label, index) => (
                        <Switch
                          key={index}
                          name={label.toLowerCase().replace(/\s+/g, '')}
                          text={t(label.toLowerCase(), label)}
                        />
                      ))}
                    </ContentSwitcher>
                  )}
                />
              </section>
              <section className={styles.section}>
                {contentSwitcherIndex !== 0 && (
                  <>
                    <div className={styles.sectionTitle}>{t('priorityLevel', 'Priority Levels')}</div>
                    <ResponsiveWrapper isTablet={isTablet}>
                      <Controller
                        name="priority"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            aria-label={t('prioritylevels', 'Priority Levels')}
                            invalid={!!errors.priority}
                            invalidText={errors.priority?.message}
                            id="priority-levels"
                            titleText=""
                            label="Choose a priority level"
                            items={priorityLevels ?? []}
                            initialSelectedItem={priorityLevels[0]}
                            itemToString={(item) => (item ? String(item) : '')}
                            onChange={(e) => {
                              if (!e.selectedItem) {
                                return;
                              }

                              field.onChange(e.selectedItem?.id);
                            }}
                          />
                        )}
                      />
                    </ResponsiveWrapper>
                  </>
                )}
              </section>

              <section className={styles.section}>
                <div className={styles.sectionTitle}>{t('visitNotes', 'Visit Notes')}</div>
                <ResponsiveWrapper isTablet={isTablet}>
                  <Controller
                    name="comment"
                    control={control}
                    defaultValue="NA"
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        aria-label={t('comment', 'Comment')}
                        invalid={!!errors.comment}
                        invalidText={errors.comment?.message}
                        labelText=""
                        id="comment"
                        name="comment"
                        maxCount={500}
                        enableCounter
                      />
                    )}
                  />
                </ResponsiveWrapper>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionTitle}>{t('nextServicePoint', 'Next service point')}</div>
                <ResponsiveWrapper isTablet={isTablet}>
                  <Controller
                    name="locationTo"
                    control={control}
                    defaultValue={queueRoomLocations.length > 0 ? queueRoomLocations[0].uuid : ''}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelText={''}
                        id="nextQueueLocation"
                        name="nextQueueLocation"
                        disabled={errorLoadingQueueRooms}
                        invalid={!!errors.locationTo}
                        invalidText={errors.locationTo?.message}
                        value={field.value}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                          setSelectedNextQueueLocation(event.target.value);
                        }}
                      >
                        {!field.value ? (
                          <SelectItem text={t('selectNextServicePoint', 'Choose next service point')} value="" />
                        ) : null}
                        {queueRoomLocations.map((location) => (
                          <SelectItem key={location.uuid} text={location.display} value={location.uuid}>
                            {location.display}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  {errorLoadingQueueRooms && (
                    <InlineNotification
                      className={styles.errorNotification}
                      kind="error"
                      onClick={() => {}}
                      subtitle={errorLoadingQueueRooms}
                      title={t('errorFetchingQueueRooms', 'Error fetching queue rooms')}
                    />
                  )}
                </ResponsiveWrapper>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionTitle}>{t('selectAProvider', 'Select a provider')}</div>
                <ResponsiveWrapper isTablet={isTablet}>
                  <Controller
                    name="provider"
                    control={control}
                    defaultValue={providers.length > 0 ? providers[0].uuid : ''}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelText={''}
                        id="providers-list"
                        name="providers-list"
                        disabled={errorLoadingProviders}
                        invalid={!!errors.provider}
                        invalidText={errors.provider?.message}
                        value={field.value}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                          setSelectedProvider(event.target.value);
                        }}
                      >
                        {!field.value ? <SelectItem text={t('selectProvider', 'choose a provider')} value="" /> : null}
                        {providers.map((provider) => (
                          <SelectItem key={provider.uuid} text={provider.display} value={provider.uuid}>
                            {provider.display}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  {errorLoadingProviders && (
                    <InlineNotification
                      className={styles.errorNotification}
                      kind="error"
                      onClick={() => {}}
                      subtitle={errorLoadingProviders}
                      title={t('errorFetchingQueueRooms', 'Error fetching providers')}
                    />
                  )}
                </ResponsiveWrapper>
              </section>
            </Stack>
          </div>
          <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
            <Button className={styles.button} kind="secondary" onClick={closePanel}>
              {t('discard', 'Discard')}
            </Button>
            <Button className={styles.button} disabled={isSubmitting} kind="primary" type="submit">
              {isSubmitting ? (
                <InlineLoading description={t('saving', 'Saving') + '...'} />
              ) : (
                <span>{t('startVisit', 'Start visit')}</span>
              )}
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
