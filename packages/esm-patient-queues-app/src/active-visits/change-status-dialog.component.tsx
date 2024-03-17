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

import {
  navigate,
  parseDate,
  setCurrentVisit,
  showNotification,
  showSnackbar,
  showToast,
  updateVisit,
  useLocations,
  useSession,
  useVisit,
} from '@openmrs/esm-framework';

import { addQueueEntry, getCareProvider, updateQueueEntry } from './active-visits-table.resource';
import { first } from 'rxjs/operators';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueueRoomLocations } from '../hooks/useQueueRooms';
import { MappedQueueEntry } from '../types';
import { ArrowUp, ArrowDown } from '@carbon/react/icons';

import styles from './change-status-dialog.scss';
import { useProviders } from '../visit-form/queue.resource';
import { QueueStatus } from '../utils/utils';

interface ChangeStatusDialogProps {
  queueEntry: MappedQueueEntry;
  currentEntry: MappedQueueEntry;
  closeModal: () => void;
}

const ChangeStatus: React.FC<ChangeStatusDialogProps> = ({ queueEntry, currentEntry, closeModal }) => {
  const { t } = useTranslation();

  const locations = useLocations();

  const { providers } = useProviders();

  const [selectedLocation, setSelectedLocation] = useState('');

  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(1);

  const [statusSwitcherIndex, setStatusSwitcherIndex] = useState(1);

  const [status, setStatus] = useState('');

  const sessionUser = useSession();

  const { queueRoomLocations, mutate } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);

  const [provider, setProvider] = useState('');

  const [priorityComment, setPriorityComment] = useState('');

  const [selectedProvider, setSelectedProvider] = useState('');

  const { currentVisit, currentVisitIsRetrospective } = useVisit(queueEntry.patientUuid);

  useEffect(() => {
    getCareProvider(sessionUser?.user?.systemId).then(
      (response) => {
        setProvider(response?.data?.results[0].uuid);
        mutate();
      },
      (error) => {
        showNotification({
          title: t(`errorGettingProvider', 'Couldn't get provider`),
          kind: 'error',
          critical: true,
          description: error?.message,
        });
      },
    );
  });

  useEffect(() => {
    if (locations?.length && sessionUser) {
      setSelectedLocation(sessionUser?.sessionLocation?.uuid);
    }
  }, [locations, sessionUser]);

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

  const filteredlocations = queueRoomLocations?.filter((location) => location.uuid != selectedLocation);

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
    if (currentVisitIsRetrospective) {
      setCurrentVisit(null, null);
      closeModal();
    } else {
      const endVisitPayload = {
        location: currentVisit.location.uuid,
        startDatetime: parseDate(currentVisit.startDatetime),
        visitType: currentVisit.visitType.uuid,
        stopDatetime: new Date(),
      };

      const abortController = new AbortController();
      updateVisit(currentVisit.uuid, endVisitPayload, abortController)
        .pipe(first())
        .subscribe(
          (response) => {
            if (response.status === 200) {
              const comment = event?.target['nextNotes']?.value ?? 'Not Set';
              updateQueueEntry(
                QueueStatus.Completed,
                provider,
                queueEntry?.id,
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
    }
  };

  // change to picked
  const changeQueueStatus = useCallback(
    (event: { preventDefault: () => void; target: { [x: string]: { value: string } } }) => {
      event.preventDefault();

      // check status

      if (status === QueueStatus.Pending) {
        const comment = event?.target['nextNotes']?.value ?? 'Not Set';
        updateQueueEntry(status, provider, queueEntry?.id, 0, priorityComment, comment).then(
          () => {
            showToast({
              critical: true,
              title: t('updateEntry', 'Update entry'),
              kind: 'success',
              description: t('queueEntryUpdateSuccessfully', 'Queue Entry Updated Successfully'),
            });
            closeModal();
            mutate();
          },
          (error) => {
            showNotification({
              title: t('queueEntryUpdateFailed', 'Error updating queue entry status'),
              kind: 'error',
              critical: true,
              description: error?.message,
            });
          },
        );
      } else if (status === QueueStatus.Completed) {
        const comment = event?.target['nextNotes']?.value ?? 'Not Set';
        const nextQueueLocationUuid = event?.target['nextQueueLocation']?.value;

        updateQueueEntry(
          QueueStatus.Completed,
          provider,
          queueEntry?.id,
          contentSwitcherIndex,
          priorityComment,
          comment,
        ).then(
          () => {
            showToast({
              critical: true,
              title: t('completePatient', 'Completed Patient'),
              kind: 'success',
              description: t('endVisitSuccessfully', 'You have successfully completed working on the pa'),
            });
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

        addQueueEntry(
          nextQueueLocationUuid,
          queueEntry?.patientUuid,
          selectedProvider,
          contentSwitcherIndex,
          QueueStatus.Pending,
          selectedLocation,
          priorityComment,
          comment,
        ).then(
          () => {
            showToast({
              critical: true,
              title: t('updateEntry', 'Move to next queue'),
              kind: 'success',
              description: t('movetonextqueue', 'Move to next queue successfully'),
            });
            //pick and route
            updateQueueEntry(
              QueueStatus.Picked,
              provider,
              currentEntry?.id,
              contentSwitcherIndex,
              priorityComment,
              'comment',
            ).then(
              () => {
                // view patient summary
                navigate({ to: `\${openmrsSpaBase}/patient/${currentEntry.patientUuid}/chart` });

                closeModal();
                mutate();
              },
              (error) => {
                showNotification({
                  title: t('queueEntryUpdateFailed', 'Error updating queue entry status'),
                  kind: 'error',
                  critical: true,
                  description: error?.message,
                });
              },
            );

            closeModal();
            mutate();
          },
          (error) => {
            showNotification({
              title: t('queueEntryUpdateFailed', 'Error updating queue entry status'),
              kind: 'error',
              critical: true,
              description: error?.message,
            });
          },
        );
      }
    },
    [
      status,
      provider,
      queueEntry?.id,
      queueEntry?.patientUuid,
      priorityComment,
      t,
      closeModal,
      mutate,
      contentSwitcherIndex,
      selectedProvider,
      selectedLocation,
      currentEntry?.id,
      currentEntry.patientUuid,
    ],
  );

  if (queueEntry && Object.keys(queueEntry)?.length === 0) {
    return <ModalHeader closeModal={closeModal} title={t('patientNotInQueue', 'The patient is not in the queue')} />;
  }

  if (queueEntry && Object.keys(queueEntry)?.length > 0) {
    return (
      <div>
        <Form onSubmit={changeQueueStatus}>
          <ModalHeader closeModal={closeModal} />
          <ModalBody>
            <div className={styles.modalBody}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h4 className={styles.section}> Currently Picked :</h4>
                <div style={{ margin: '10px' }}>
                  <ArrowDown size={20} />
                </div>
              </div>
              {currentEntry?.name ? (
                <h5 className={styles.section}>
                  {currentEntry?.name} &nbsp; · &nbsp;{currentEntry?.patientSex} &nbsp; · &nbsp;
                  {currentEntry?.patientAge}
                  &nbsp;
                  {t('years', 'Years')}
                </h5>
              ) : (
                '--'
              )}

              <br></br>
              <hr />
              <br></br>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h4 className={styles.section}> Queue to next service area :</h4>
                <div style={{ margin: '10px' }}>
                  <ArrowUp size={20} />
                </div>
              </div>
              {queueEntry?.name ? (
                <h5 className={styles.section}>
                  {queueEntry?.name} &nbsp; · &nbsp;{queueEntry?.patientSex} &nbsp; · &nbsp;{queueEntry?.patientAge}
                  &nbsp;
                  {t('years', 'Years')}
                </h5>
              ) : (
                '--'
              )}
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
  }
};

export default ChangeStatus;
