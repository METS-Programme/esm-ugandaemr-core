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
  useSession,
  useVisit,
} from '@openmrs/esm-framework';
import { addQueueEntry, getCareProvider, updateQueueEntry } from './active-visits-table.resource';
import { useQueueRoomLocations } from '../hooks/useQueueRooms';
import { getCurrentPatientQueueByPatientUuid, useProviders } from '../visit-form/queue.resource';
import styles from './change-status-dialog.scss';
import { first } from 'rxjs/operators';
import { QueueStatus, extractErrorMessagesFromResponse } from '../utils/utils';

interface ChangeStatusDialogProps {
  patientUuid: string;
  closeModal: () => void;
}

const ChangeStatusMoveToNext: React.FC<ChangeStatusDialogProps> = ({ patientUuid, closeModal }) => {
  const { t } = useTranslation();

  const sessionUser = useSession();
  let isCancelled = false;

  const { providers } = useProviders();

  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(1);

  const [statusSwitcherIndex, setStatusSwitcherIndex] = useState(1);

  const [status, setStatus] = useState('');

  const { queueRoomLocations, mutate } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);

  const [provider, setProvider] = useState('');

  const [priorityComment, setPriorityComment] = useState('');

  const [selectedProvider, setSelectedProvider] = useState('');

  const { activeVisit } = useVisit(patientUuid);

  const providerUuid = useMemo(() => {
    if (!sessionUser?.user?.uuid) return null;

    getCareProvider(sessionUser?.user?.uuid).then(
      (response) => {
        if (!isCancelled) {
          const uuid = response?.data?.results[0].uuid;
          setProvider(uuid);
          mutate();
        }
      },
      (error) => {
        if (!isCancelled) {
          const errorMessages = extractErrorMessagesFromResponse(error);

          showNotification({
            title: "Couldn't get provider",
            kind: 'error',
            critical: true,
            description: errorMessages.join(','),
          });
        }
      },
    );

    return providerUuid;
  }, [sessionUser?.user?.uuid]);

  useEffect(() => {
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => providerUuid, [providerUuid]);

  useMemo(() => {
    switch (statusSwitcherIndex) {
      case 0: {
        setStatus(QueueStatus.Pending);
        break;
      }
      case 1: {
        setStatus(QueueStatus.Completed);
        break;
      }
    }
  }, [statusSwitcherIndex]);

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
    updateVisit(activeVisit.uuid, endVisitPayload, abortController)
      .pipe(first())
      .subscribe(
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
  const changeQueueStatus = useCallback(
    (event: { preventDefault: () => void; target: { [x: string]: { value: string } } }) => {
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
      <Form onSubmit={changeQueueStatus}>
        <ModalHeader closeModal={closeModal} />
        <ModalBody>
          <div className={styles.modalBody}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h4 className={styles.section}> Queue to next service area</h4>
            </div>
          </div>
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
            <div className={styles.sectionTitle}>{t('status', 'Status')}</div>
            <ContentSwitcher
              selectedIndex={statusSwitcherIndex}
              className={styles.contentSwitcher}
              onChange={({ index }) => setStatusSwitcherIndex(index)}
            >
              <Switch name="pending" text={t('pending', 'Move to Pending')} />
              <Switch name="completed" text={t('completed', 'Move to completed')} />
            </ContentSwitcher>
          </section>

          {status === QueueStatus.Completed && (
            <section className={styles.section}>
              <Select
                labelText={t('selectNextQueueRoom', 'Select next queue room ')}
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
            </section>
          )}

          {status === QueueStatus.Completed && (
            <section className={styles.section}>
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
            </section>
          )}

          {status === QueueStatus.Completed && (
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
          )}
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button kind="danger" onClick={endCurrentVisit}>
            {t('endVisit', 'End Visit')}
          </Button>
          <Button type="submit">{status === 'pending' ? 'Save' : 'Move to the next queue room'}</Button>
        </ModalFooter>
      </Form>
    </div>
  );
};

export default ChangeStatusMoveToNext;
