import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  ContentSwitcher,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  TextArea,
  InlineLoading,
  Layer,
  InlineNotification,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import {
  getSessionStore,
  navigate,
  restBaseUrl,
  showNotification,
  showToast,
  useLayoutType,
  useSession,
} from '@openmrs/esm-framework';
import { useQueueRoomLocations } from '../hooks/useQueueRooms';
import styles from './change-status-dialog.scss';
import { QueueStatus, extractErrorMessagesFromResponse, handleMutate } from '../utils/utils';
import { PatientQueue } from '../types/patient-queues';
import { addQueueEntry, getCareProvider, getCurrentPatientQueueByPatientUuid, updateQueueEntry, useProviders } from './patient-queues.resource';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { CreateQueueEntryFormData, createQueueEntrySchema } from './patient-queue-validation-schema.resource';

interface ChangeStatusDialogProps {
  patient: string;
  entries: PatientQueue[];
  closeModal: () => void;
}

const QueueTableMoveToNext: React.FC<ChangeStatusDialogProps> = ({ patient, entries, closeModal }) => {
  const { t } = useTranslation();

  const sessionUser = useSession();

  const isTablet = useLayoutType() === 'tablet';

  const [isLoading, setIsLoading] = useState(true);

  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(1);

  const [statusSwitcherIndex, setStatusSwitcherIndex] = useState(1);

  const [status, setStatus] = useState('');

  const { queueRoomLocations, error: errorLoadingQueueRooms } = useQueueRoomLocations(
    sessionUser?.sessionLocation?.uuid,
  );

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);

  const [provider, setProvider] = useState('');

  const [priorityComment, setPriorityComment] = useState('');

  const [selectedProvider, setSelectedProvider] = useState('');

  const { providers, error: errorLoadingProviders } = useProviders(selectedNextQueueLocation);

  // Memoize the function to fetch the provider using useCallback
  const fetchProvider = useCallback(() => {
    if (!sessionUser?.user?.uuid) return;

    setIsLoading(true);

    getCareProvider(sessionUser?.user?.uuid).then(
      (response) => {
        const uuid = response?.data?.results[0].uuid;
        setIsLoading(false);
        setProvider(uuid);
      },
      (error) => {
        const errorMessages = extractErrorMessagesFromResponse(error);
        setIsLoading(false);
        showNotification({
          title: "Couldn't get provider",
          kind: 'error',
          critical: true,
          description: errorMessages.join(','),
        });
      },
    );
  }, [sessionUser?.user?.uuid]);

  useEffect(() => fetchProvider(), [fetchProvider]);

  const priorityLabels = useMemo(() => ['Not Urgent', 'Urgent', 'Emergency'], []);

  const statusLabels = useMemo(
    () => [
      { status: 'pending', label: 'Move to Pending' },
      { status: 'completed', label: 'Move to Completed' },
    ],
    [],
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQueueEntryFormData>({
    mode: 'all',
    resolver: zodResolver(createQueueEntrySchema),
  });

  useEffect(() => {
    setPriorityComment(priorityLabels[contentSwitcherIndex]);
  }, [contentSwitcherIndex, priorityLabels]);

  useEffect(() => {
    setStatus(statusLabels[statusSwitcherIndex].status);
  }, [statusSwitcherIndex, statusLabels]);

  // change to picked
  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      // check status
      if (status === QueueStatus.Pending) {
        const comment = event?.target['nextNotes']?.value ?? 'Not Set';
        getCurrentPatientQueueByPatientUuid(patient, sessionUser?.sessionLocation?.uuid).then(
          () => {
            const queueEntry = entries?.filter((item) => item?.patient?.uuid === patient);

            if (queueEntry.length > 0) {
              updateQueueEntry(status, provider, queueEntry[0]?.uuid, 0, priorityComment, comment).then(() => {
                showToast({
                  critical: true,
                  title: t('moveToNextServicePoint', 'Move back your service point'),
                  kind: 'success',
                  description: t('backToQueue', 'Successfully moved back patient to your service point'),
                });
                closeModal();
                handleMutate(`${restBaseUrl}/patientqueue`);
              });
            } else if (queueEntry.length === 1) {
              updateQueueEntry(status, provider, queueEntry[0]?.uuid, 0, priorityComment, comment).then(() => {
                showToast({
                  critical: true,
                  title: t('moveToNextServicePoint', 'Move back your service point'),
                  kind: 'success',
                  description: t('backToQueue', 'Successfully moved back patient to your service point'),
                });
                closeModal();
                handleMutate(`${restBaseUrl}/patientqueue`);
              });
            }
          },
          (error) => {
            const errorMessages = extractErrorMessagesFromResponse(error);
            showNotification({
              title: t('errorMovinPatientToNextServicePoint', 'Error Moving Patient to next service point'),
              kind: 'error',
              critical: true,
              description: errorMessages.join(','),
            });
          },
        );
      } else if (status === QueueStatus.Completed) {
        const comment = event?.target['nextNotes']?.value ?? 'Not Set';

        getCurrentPatientQueueByPatientUuid(patient, sessionUser?.sessionLocation?.uuid).then(
          () => {
            const queueEntry = entries?.filter((item) => item?.patient?.uuid === patient);

            if (queueEntry.length > 0) {
              updateQueueEntry(
                QueueStatus.Completed,
                provider,
                queueEntry[0]?.uuid,
                contentSwitcherIndex,
                priorityComment,
                comment,
              ).then(
                () => {
                  addQueueEntry(
                    selectedNextQueueLocation,
                    patient,
                    selectedProvider,
                    contentSwitcherIndex,
                    QueueStatus.Pending,
                    sessionUser?.sessionLocation?.uuid,
                    priorityComment,
                    comment,
                  ).then(
                    (res) => {
                      updateQueueEntry(
                        QueueStatus.Pending,
                        selectedProvider,
                        res.data?.uuid,
                        contentSwitcherIndex,
                        priorityComment,
                        comment,
                      ).then(
                        () => {
                          showToast({
                            critical: true,
                            title: t('moveToNextServicePoint', 'Move to next service point'),
                            kind: 'success',
                            description: t('movetonextservicepoint', 'Moved to next service point successfully'),
                          });
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

                          closeModal();
                        },
                        (error) => {
                          const errorMessages = extractErrorMessagesFromResponse(error);
                          showNotification({
                            title: t('queueEntryUpdateFailed', 'Error updating next service point'),
                            kind: 'error',
                            critical: true,
                            description: errorMessages.join(','),
                          });
                        },
                      );
                      closeModal();
                    },
                    (error) => {
                      const errorMessages = extractErrorMessagesFromResponse(error);

                      showNotification({
                        title: t('queueEntryUpdateFailed', 'Error updating next service point'),
                        kind: 'error',
                        critical: true,
                        description: errorMessages.join(','),
                      });
                    },
                  );
                },
                () => {},
              );
            } else if (queueEntry.length === 1) {
              updateQueueEntry(
                QueueStatus.Completed,
                provider,
                queueEntry[0]?.uuid,
                contentSwitcherIndex,
                priorityComment,
                comment,
              ).then(
                () => {
                  addQueueEntry(
                    selectedNextQueueLocation,
                    patient,
                    selectedProvider,
                    contentSwitcherIndex,
                    QueueStatus.Pending,
                    sessionUser?.sessionLocation?.uuid,
                    priorityComment,
                    comment,
                  ).then(
                    (res) => {
                      updateQueueEntry(
                        QueueStatus.Pending,
                        selectedProvider,
                        res.data?.uuid,
                        contentSwitcherIndex,
                        priorityComment,
                        comment,
                      ).then(
                        () => {
                          showToast({
                            critical: true,
                            title: t('successfullyMovedToNextServicePoint', 'Moved to Next Service Point'),
                            kind: 'success',
                            description: t('movetonextservicepoint', 'Successfully moved to next service point'),
                          });
                          // view patient summary
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
                          closeModal();
                        },
                        (error) => {
                          const errorMessages = extractErrorMessagesFromResponse(error);
                          showNotification({
                            title: t('errorGettingPatientQueueEntry', 'Error Moving Patient to next service point'),
                            kind: 'error',
                            critical: true,
                            description: errorMessages.join(','),
                          });
                        },
                      );
                      closeModal();
                    },
                    (error) => {
                      const errorMessages = extractErrorMessagesFromResponse(error);

                      showNotification({
                        title: t('errorUpdatingServicePoint', 'Error updating next service point status'),
                        kind: 'error',
                        critical: true,
                        description: errorMessages.join(','),
                      });
                    },
                  );
                },
                () => {},
              );
            }
          },
          (error) => {
            const errorMessages = extractErrorMessagesFromResponse(error);
            showNotification({
              title: t('errorUpdatingServicePoint', 'Error updating next service point status'),
              kind: 'error',
              critical: true,
              description: errorMessages.join(','),
            });
          },
        );
      }
    },
    [
      closeModal,
      contentSwitcherIndex,
      patient,
      priorityComment,
      provider,
      selectedNextQueueLocation,
      selectedProvider,
      sessionUser?.sessionLocation?.uuid,
      status,
      entries,
      t,
    ],
  );

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader closeModal={closeModal} />
        <ModalBody>
          <div className={styles.modalBody}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h4 className={styles.section}> Queue to next service area</h4>
            </div>
          </div>
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
            <div className={styles.sectionTitle}>{t('status', 'Status')}</div>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <ContentSwitcher
                  {...field}
                  selectedIndex={statusSwitcherIndex}
                  className={styles.contentSwitcher}
                  onChange={({ index }) => {
                    field.onChange(index);
                    setStatusSwitcherIndex(index);
                  }}
                >
                  {statusLabels.map((status, index) => (
                    <Switch
                      key={index}
                      name={status.label.toLowerCase().replace(' ', '')}
                      text={t(status.label.toLowerCase(), status.label)}
                    />
                  ))}
                </ContentSwitcher>
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
              <section className={styles.section}>
                <div className={styles.sectionTitle}>{t('notes', 'Notes')}</div>
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
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t('cancel', 'Cancel')}
          </Button>
          {isLoading ? (
            <InlineLoading description={'Fetching Provider..'} />
          ) : (
            <Button type="submit">{status === 'pending' ? 'Save' : 'Move to the next queue room'}</Button>
          )}
        </ModalFooter>
      </Form>
    </div>
  );
};

function ResponsiveWrapper({ children, isTablet }) {
  return isTablet ? <Layer>{children}</Layer> : <div>{children}</div>;
}

export default QueueTableMoveToNext;
