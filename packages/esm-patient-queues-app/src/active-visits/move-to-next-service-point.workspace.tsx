import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Button,
  ContentSwitcher,
  Select,
  SelectItem,
  Switch,
  InlineLoading,
  TextArea,
  Layer,
  InlineNotification,
  ButtonSet,
} from '@carbon/react';
import {
  type DefaultWorkspaceProps,
  navigate,
  restBaseUrl,
  showNotification,
  showToast,
  useLayoutType,
  useSession,
  getSessionStore,
} from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { useQueueRoomLocations } from '../hooks/useQueueRooms';
import styles from './move-to-next-service-point.scss';
import { QueueStatus, extractErrorMessagesFromResponse, handleMutate } from '../utils/utils';
import {
  NewQueuePayload,
  addQueueEntry,
  getCareProvider,
  getCurrentPatientQueueByPatientUuid,
  getPatientQueueUuid,
  updateQueueEntry,
  useProviders,
} from './patient-queues.resource';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateQueueEntryFormData, createQueueEntrySchema } from './patient-queue-validation-schema.resource';
import { getSelectedPatientQueueUuid } from '../helpers/helpers';
import { PatientQueue } from '../types/patient-queues';

type MoveToNextServicePointFormProps = DefaultWorkspaceProps & {
  patientUuid: string;
};

const MoveToNextServicePointForm: React.FC<MoveToNextServicePointFormProps> = ({ patientUuid, closeWorkspace }) => {
  // Hooks
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const sessionUser = useSession();
  const patientQueueUuid = getSelectedPatientQueueUuid().getState();

  // States
  const [queueEntry, setQueueEntry] = useState<PatientQueue>();
  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(1);
  const [statusSwitcherIndex, setStatusSwitcherIndex] = useState(1);
  const [status, setStatus] = useState('');
  const [provider, setProvider] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [priorityComment, setPriorityComment] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data Fetching Hooks
  const { queueRoomLocations, error: errorLoadingQueueRooms } = useQueueRoomLocations(
    sessionUser?.sessionLocation?.uuid,
  );
  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);
  const { providers, error: errorLoadingProviders } = useProviders(selectedNextQueueLocation);

  // Memoized constants
  const priorityLabels = useMemo(() => ['Not Urgent', 'Urgent', 'Emergency'], []);
  const statusLabels = useMemo(
    () => [
      { status: 'pending', label: 'Move to Pending' },
      { status: 'completed', label: 'Move to Completed' },
    ],
    [],
  );

  // Fetch provider info
  const fetchProvider = useCallback(() => {
    if (!sessionUser?.user?.uuid) return;

    setIsLoading(true);
    getCareProvider(sessionUser.user.uuid)
      .then((response) => {
        const uuid = response?.data?.results?.[0]?.uuid;
        setProvider(uuid);
      })
      .catch((error) => {
        const errorMessages = extractErrorMessagesFromResponse(error);
        showNotification({
          title: "Couldn't get provider",
          kind: 'error',
          critical: true,
          description: errorMessages.join(','),
        });
      })
      .finally(() => setIsLoading(false));
  }, [sessionUser?.user?.uuid]);

  // Fetch queue entry
  const fetchQueueEntry = useCallback(async () => {
    try {
      const response = await getPatientQueueUuid(patientQueueUuid.patientQueueUuid);

      if (response?.status === 200 && response?.data) {
        setQueueEntry(response.data);
      } else {
        showNotification({
          title: 'Queue entry not found',
          kind: 'warning',
          description: 'The server did not return a valid queue entry.',
        });
      }
    } catch (error) {
      const errorMessages = extractErrorMessagesFromResponse(error);
      showNotification({
        title: "Couldn't get queue entry",
        kind: 'error',
        critical: true,
        description: errorMessages.join(', '),
      });
    }
  }, [patientQueueUuid]);

  // Effects
  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  useEffect(() => {
    if (patientQueueUuid) {
      fetchQueueEntry();
    }
  }, [patientQueueUuid, fetchQueueEntry]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQueueEntryFormData>({
    mode: 'all',
    resolver: zodResolver(createQueueEntrySchema),
    defaultValues: {
      priorityComment: priorityLabels[contentSwitcherIndex],
      status: statusLabels[statusSwitcherIndex].status,
    },
  });

  useEffect(() => {
    setPriorityComment(priorityLabels[contentSwitcherIndex]);
  }, [contentSwitcherIndex, priorityLabels]);

  useEffect(() => {
    setStatus(statusLabels[statusSwitcherIndex].status);
  }, [statusSwitcherIndex, statusLabels]);

  const handleSave = useCallback(async () => {
    try {
      setIsSubmitting(true);
      // get queue entry by patient id
      const patientQueueEntryResponse = await getCurrentPatientQueueByPatientUuid(
        patientUuid,
        sessionUser?.sessionLocation?.uuid,
      );

      const queues = patientQueueEntryResponse.data?.results[0]?.patientQueues;
      const queueEntry = queues?.filter((item) => item?.patient?.uuid === patientUuid);

      if (status === QueueStatus.Pending) {
        if (queueEntry.length > 0) {
          await updateQueueEntry(status, provider, queueEntry[0]?.uuid, 0, priorityComment, comment).then(() => {
            showToast({
              critical: true,
              title: t('moveToNextServicePoint', 'Move back your service point'),
              kind: 'success',
              description: t('backToQueue', 'Successfully moved back patient to your service point'),
            });
            closeWorkspace();
            handleMutate(`${restBaseUrl}/patientqueue`);
            setIsSubmitting(false);
          });
        }
      }

      if (status === QueueStatus.Completed) {
        if (queueEntry.length > 0) {
          await updateQueueEntry(
            QueueStatus.Completed,
            provider,
            queueEntry[0]?.uuid,
            contentSwitcherIndex,
            priorityComment,
            comment,
          );

          const request: NewQueuePayload = {
            patient: patientUuid,
            provider: selectedProvider ?? '',
            locationFrom: sessionUser?.sessionLocation?.uuid,
            locationTo: selectedNextQueueLocation,
            status: QueueStatus.Pending,
            priority: contentSwitcherIndex,
            priorityComment: priorityComment,
            comment: comment,
            queueRoom: selectedNextQueueLocation,
          };

          const createQueueResponse = await addQueueEntry(request);

          const response = await updateQueueEntry(
            QueueStatus.Pending,
            provider,
            createQueueResponse.data?.uuid,
            contentSwitcherIndex,
            priorityComment,
            comment,
          );

          if (response.status === 200) {
            showToast({
              critical: true,
              title: t('moveToNextServicePoint', 'Move to next service point'),
              kind: 'success',
              description: t('movetonextservicepoint', 'Moved to next service point successfully'),
            });
            handleMutate(`${restBaseUrl}/patientqueue`);
            closeWorkspace();
            setIsSubmitting(false);
            // view patient summary
            // navigate({ to: `\${openmrsSpaBase}/home` });
            const roles = getSessionStore().getState().session?.user?.roles;
            const roleName = roles[0]?.display;
            if (roles && roles?.length > 0) {
              if (roles?.filter((item) => item?.display === 'Organizational: Clinician').length > 0) {
                navigate({
                  to: `${window.getOpenmrsSpaBase()}home/clinical-room-patient-queues`,
                });
              } else if (roleName === 'Triage') {
                navigate({
                  to: `${window.getOpenmrsSpaBase()}home/triage-patient-queues`,
                });
              } else {
                navigate({ to: `${window.getOpenmrsSpaBase()}home` });
              }
            }
          }
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      const errorMessages = extractErrorMessagesFromResponse(error);
      showNotification({
        title: t('moveToNextServicePoint', 'Error moving to next service point'),
        kind: 'error',
        critical: true,
        description: errorMessages.join(','),
      });
      handleMutate(`${restBaseUrl}/patientqueue`);
      closeWorkspace();
    }
  }, [
    closeWorkspace,
    contentSwitcherIndex,
    patientUuid,
    priorityComment,
    provider,
    selectedNextQueueLocation,
    selectedProvider,
    sessionUser?.sessionLocation?.uuid,
    status,
    comment,
    t,
  ]);

  return (
    <div className={styles.container}>
      {isLoading && <InlineLoading description={'Fetching Provider..'} />}

      <div className={styles.body}>
        {Object.keys(errors).length > 0 && (
          <div className={styles.errorMessage}>
            <ul>
              {Object.entries(errors).map(([key, error]) => (
                <li key={key}>
                  {key}: {error?.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>{t('priority', 'Priority')}</div>
          <Controller
            name="priorityComment"
            control={control}
            render={({ field }) => (
              <>
                <ContentSwitcher
                  {...field}
                  selectedIndex={contentSwitcherIndex}
                  className={styles.contentSwitcher}
                  onChange={({ index }) => {
                    field.onChange(priorityLabels[index]);
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
                {errors.priorityComment && <p className={styles.errorMessage}>{errors.priorityComment.message}</p>}
              </>
            )}
          />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>{t('status', 'Status')}</div>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <>
                <ContentSwitcher
                  {...field}
                  selectedIndex={statusSwitcherIndex}
                  className={styles.contentSwitcher}
                  onChange={({ index }) => {
                    field.onChange(statusLabels[index].status);
                    setStatusSwitcherIndex(index);
                  }}
                >
                  {statusLabels.map((status, index) => (
                    <Switch
                      key={index}
                      name={status.label.toLowerCase().replace(/\s+/g, '')}
                      text={t(status.label.toLowerCase(), status.label)}
                    />
                  ))}
                </ContentSwitcher>
                {errors.status && <p className={styles.errorMessage}>{errors.status.message}</p>}
              </>
            )}
          />
        </section>

        {status === QueueStatus.Completed && (
          <>
            <section className={styles.section}>
              <div className={styles.sectionTitle}>{t('nextServicePoint', 'Next service point')}</div>
              <ResponsiveWrapper isTablet={isTablet}>
                <Controller
                  name="locationTo"
                  control={control}
                  defaultValue={queueRoomLocations[0]?.uuid || ''}
                  render={({ field }) => (
                    <Select
                      {...field}
                      id="nextQueueLocation"
                      name="nextQueueLocation"
                      labelText=""
                      disabled={errorLoadingQueueRooms}
                      invalid={!!errors.locationTo}
                      invalidText={errors.locationTo?.message}
                      value={field.value}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        field.onChange(selectedValue);
                        setSelectedNextQueueLocation(selectedValue);
                      }}
                    >
                      {!field.value && (
                        <SelectItem value="" text={t('selectNextServicePoint', 'Choose next service point')} />
                      )}

                      {queueRoomLocations.map(({ uuid, display }) => (
                        <SelectItem key={uuid} value={uuid} text={display} />
                      ))}
                    </Select>
                  )}
                />

                {errorLoadingQueueRooms && (
                  <InlineNotification
                    className={styles.errorNotification}
                    kind="error"
                    title={t('errorFetchingQueueRooms', 'Error fetching queue rooms')}
                    subtitle={errorLoadingQueueRooms}
                    onClick={() => {}}
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
                    title={t('errorFetchingQueueRooms', 'Error fetching providers')}
                    subtitle={errorLoadingProviders}
                    onClick={() => {}}
                  />
                )}
              </ResponsiveWrapper>
            </section>
            <section className={styles.section}>
              <div className={styles.sectionTitle}>{t('notes', 'Notes')}</div>
              <ResponsiveWrapper isTablet={isTablet}>
                <Controller
                  name="comment"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      aria-label={t('comment', 'Comment')}
                      id="comment"
                      labelText=""
                      invalid={!!errors.comment}
                      invalidText={errors.comment?.message}
                      maxCount={500}
                      enableCounter
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setComment(e.target.value);
                      }}
                    />
                  )}
                />
              </ResponsiveWrapper>
            </section>
          </>
        )}
      </div>
      <ButtonSet className={styles.buttonSet}>
        <Button kind="secondary" onClick={closeWorkspace} className={styles.button}>
          {t('cancel', 'Cancel')}
        </Button>
        {isSubmitting ? (
          <InlineLoading description={'Submitting...'} />
        ) : (
          <Button
            disabled={!provider || isLoading || isSubmitting}
            type="submit"
            onClick={handleSubmit(handleSave)}
            className={styles.button}
          >
            {status === QueueStatus.Pending ? 'Save' : 'Move to the next queue room'}
          </Button>
        )}
      </ButtonSet>
    </div>
  );
};

function ResponsiveWrapper({ children, isTablet }) {
  return isTablet ? <Layer>{children}</Layer> : <div>{children}</div>;
}

export default MoveToNextServicePointForm;
