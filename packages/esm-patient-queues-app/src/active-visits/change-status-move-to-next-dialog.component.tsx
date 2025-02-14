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
  parseDate,
  showNotification,
  showSnackbar,
  showToast,
  updateVisit,
  useLayoutType,
  useSession,
  useVisit,
} from '@openmrs/esm-framework';
import { addQueueEntry, getCareProvider, updateQueueEntry } from './active-visits-table.resource';
import { useQueueRoomLocations } from '../hooks/useQueueRooms';
import styles from './change-status-dialog.scss';
import { QueueStatus, extractErrorMessagesFromResponse } from '../utils/utils';
import { getCurrentPatientQueueByPatientUuid, useProviders } from './patient-queues.resource';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateQueueEntryFormData, createQueueEntrySchema } from './patient-queue-validation-schema.resource';
import { Controller, useForm } from 'react-hook-form';

interface ChangeStatusDialogProps {
  patientUuid: string;
  closeModal: () => void;
}

const ChangeStatusMoveToNext: React.FC<ChangeStatusDialogProps> = ({ patientUuid, closeModal }) => {
  const { t } = useTranslation();

  const isTablet = useLayoutType() === 'tablet';

  const sessionUser = useSession();

  const { providers, error: errorLoadingProviders } = useProviders();

  const [isLoading, setIsLoading] = useState(true);

  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(1);

  const [statusSwitcherIndex, setStatusSwitcherIndex] = useState(1);

  const [status, setStatus] = useState('');

  const {
    queueRoomLocations,
    mutate,
    error: errorLoadingQueueRooms,
  } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);

  const [provider, setProvider] = useState('');

  const [priorityComment, setPriorityComment] = useState('');

  const [selectedProvider, setSelectedProvider] = useState('');

  const { activeVisit } = useVisit(patientUuid);

  // Memoize the function to fetch the provider using useCallback
  const fetchProvider = useCallback(() => {
    if (!sessionUser?.user?.uuid) return;

    setIsLoading(true);

    getCareProvider(sessionUser?.user?.uuid).then(
      (response) => {
        const uuid = response?.data?.results[0].uuid;
        setIsLoading(false);
        setProvider(uuid);
        mutate();
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
  }, [sessionUser?.user?.uuid, mutate]);

  useEffect(() => fetchProvider(), [fetchProvider]);

  const priorityLabels = useMemo(() => ['Not Urgent', 'Urgent', 'Emergency'], []);

  const statusLabels = useMemo(
    () => [
      { status: 'pending', label: 'Move to Pending' },
      { status: 'completed', label: 'Move to Completed' },
    ],
    [],
  );

  const { handleSubmit, control, formState } = useForm<CreateQueueEntryFormData>({
    mode: 'all',
    resolver: zodResolver(createQueueEntrySchema),
  });

  const { errors } = formState;

  useEffect(() => {
    setPriorityComment(priorityLabels[contentSwitcherIndex]);
  }, [contentSwitcherIndex, priorityLabels]);

  useEffect(() => {
    setStatus(statusLabels[statusSwitcherIndex].status);
  }, [statusSwitcherIndex, statusLabels]);

  const filteredlocations = queueRoomLocations?.filter((location) => location?.uuid != null);

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

  // endVisit
  const endCurrentVisit = () => {
    const endVisitPayload = {
      location: activeVisit.location.uuid,
      startDatetime: parseDate(activeVisit.startDatetime),
      visitType: activeVisit.visitType.uuid,
      stopDatetime: new Date(),
    };

    const abortController = new AbortController();
    updateVisit(activeVisit.uuid, endVisitPayload, abortController).then(
      (response) => {
        mutate();

        if (response.status === 200) {
          const comment = event?.target['nextNotes']?.value ?? 'Not Set';

          getCurrentPatientQueueByPatientUuid(patientUuid, sessionUser?.sessionLocation?.uuid).then(
            (res) => {
              const queues = res.data?.results[0]?.patientQueues;
              const queueEntry = queues?.filter((item) => item?.patient?.uuid === patientUuid);

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
                    showSnackbar({
                      isLowContrast: true,
                      kind: 'success',
                      subtitle: t('visitEndSuccessfully', `${response?.data?.visitType?.display} ended successfully`),
                      title: t('visitEnded', 'Visit ended'),
                    });

                    navigate({ to: `\${openmrsSpaBase}/home` });

                    closeModal();
                    mutate();
                  },
                  (error) => {
                    showNotification({
                      title: t('queueEntryUpdateFailed', 'Error ending visit'),
                      kind: 'error',
                      critical: true,
                      description: error?.message,
                    });
                  },
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
                    showSnackbar({
                      isLowContrast: true,
                      kind: 'success',
                      subtitle: t('visitEndSuccessfully', `${response?.data?.visitType?.display} ended successfully`),
                      title: t('visitEnded', 'Visit ended'),
                    });

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
                    mutate();
                  },
                  (error) => {
                    showNotification({
                      title: t('queueEntryUpdateFailed', 'Error ending visit'),
                      kind: 'error',
                      critical: true,
                      description: error?.message,
                    });
                  },
                );
              }
            },
            () => {},
          );
          mutate();
          closeModal();
        }
      },
      (error) => {
        showSnackbar({
          title: t('errorEndingVisit', 'Error ending visit'),
          kind: 'error',
          isLowContrast: false,
          subtitle: error?.message,
        });
      },
    );
  };

  // change to picked
  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      // check status
      if (status === QueueStatus.Pending) {
        const comment = event?.target['nextNotes']?.value ?? 'Not Set';
        getCurrentPatientQueueByPatientUuid(patientUuid, sessionUser?.sessionLocation?.uuid).then(
          (res) => {
            const queues = res.data?.results[0]?.patientQueues;
            const queueEntry = queues?.filter((item) => item?.patient?.uuid === patientUuid);

            if (queueEntry.length > 0) {
              updateQueueEntry(status, provider, queueEntry[0]?.uuid, 0, priorityComment, comment).then(() => {
                showToast({
                  critical: true,
                  title: t('moveToNextServicePoint', 'Move back your service point'),
                  kind: 'success',
                  description: t('backToQueue', 'Successfully moved back patient to your service point'),
                });
                closeModal();
                mutate();
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
                mutate();
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

        getCurrentPatientQueueByPatientUuid(patientUuid, sessionUser?.sessionLocation?.uuid).then(
          (res) => {
            const queues = res.data?.results[0]?.patientQueues;
            const queueEntry = queues?.filter((item) => item?.patient?.uuid === patientUuid);

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
                  mutate();
                  addQueueEntry(
                    selectedNextQueueLocation,
                    patientUuid,
                    selectedProvider,
                    contentSwitcherIndex,
                    QueueStatus.Pending,
                    sessionUser?.sessionLocation?.uuid,
                    priorityComment,
                    comment,
                  ).then(
                    (res) => {
                      mutate();
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

                          mutate();
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
                      mutate();
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
                () => {
                  mutate();
                },
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
                  mutate();
                  addQueueEntry(
                    selectedNextQueueLocation,
                    patientUuid,
                    selectedProvider,
                    contentSwitcherIndex,
                    QueueStatus.Pending,
                    sessionUser?.sessionLocation?.uuid,
                    priorityComment,
                    comment,
                  ).then(
                    (res) => {
                      mutate();
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
                          mutate();
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
                      mutate();
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
                () => {
                  mutate();
                },
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
      mutate,
      patientUuid,
      priorityComment,
      provider,
      selectedNextQueueLocation,
      selectedProvider,
      sessionUser?.sessionLocation?.uuid,
      status,
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
                    defaultValue={filteredlocations.length > 0 ? filteredlocations[0].uuid : ''}
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
                        {filteredlocations.map((location) => (
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
                    defaultValue={filteredProviders.length > 0 ? filteredProviders[0].uuid : ''}
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
                        {filteredProviders.map((provider) => (
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
          <Button kind="danger" onClick={endCurrentVisit}>
            {t('endVisit', 'End Visit')}
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

export default ChangeStatusMoveToNext;
