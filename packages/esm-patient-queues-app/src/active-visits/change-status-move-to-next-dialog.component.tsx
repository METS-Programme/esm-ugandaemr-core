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
import { navigate, showNotification, showToast, useLocations, useSession } from '@openmrs/esm-framework';
import { addQueueEntry, getCareProvider, updateQueueEntry } from './active-visits-table.resource';
import { useQueueRoomLocations } from '../patient-search/hooks/useQueueRooms';
import { getCurrentPatientQueueByPatientUuid, useProviders } from '../patient-search/visit-form/queue.resource';
import { QueueRecord } from '../types';
import styles from './change-status-dialog.scss';
import { extractErrorMessagesFromResponse } from '../utils/utils';

interface ChangeStatusDialogProps {
  patientUuid: string;
  closeModal: () => void;
}

const ChangeStatusMoveToNext: React.FC<ChangeStatusDialogProps> = ({ patientUuid, closeModal }) => {
  const { t } = useTranslation();

  const locations = useLocations();

  const sessionUser = useSession();

  const { providers } = useProviders();

  const [selectedLocation, setSelectedLocation] = useState('');

  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(1);

  const [statusSwitcherIndex, setStatusSwitcherIndex] = useState(1);

  const [status, setStatus] = useState('');

  const { queueRoomLocations } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);

  const [provider, setProvider] = useState('');

  const [priorityComment, setPriorityComment] = useState('');

  const [selectedProvider, setSelectedProvider] = useState('');

  let mappedQueueEntry: QueueRecord;

  useEffect(() => {
    getCareProvider(sessionUser?.user?.systemId).then(
      (response) => {
        setProvider(response?.data?.results[0].uuid);
        // mutate();
      },
      (error) => {
        const errorMessages = extractErrorMessagesFromResponse(error);

        showNotification({
          title: t(`errorGettingProvider', 'Couldn't get provider`),
          kind: 'error',
          critical: true,
          description: errorMessages.join(','),
        });
      },
    );
  });

  getCurrentPatientQueueByPatientUuid(patientUuid, sessionUser?.sessionLocation?.uuid).then(
    (res) => {
      mappedQueueEntry = res.data.results[0];

      console.info('mappedQueueEntry', JSON.stringify(mappedQueueEntry, null, 2));
    },
    (error) => {
      const errorMessages = extractErrorMessagesFromResponse(error);

      showNotification({
        title: t('errorGettingPatientQueueEntry', 'Error Getting Patient Queue Entry'),
        kind: 'error',
        critical: true,
        description: errorMessages.join(','),
      });
    },
  );

  useEffect(() => {
    if (locations?.length && sessionUser) {
      setSelectedLocation(sessionUser?.sessionLocation?.uuid);
    }
  }, [locations, sessionUser]);

  useMemo(() => {
    switch (statusSwitcherIndex) {
      case 0: {
        setStatus('pending');
        break;
      }
      case 1: {
        setStatus('completed');
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

  // change to picked
  const changeQueueStatus = useCallback(
    (event: { preventDefault: () => void; target: { [x: string]: { value: string } } }) => {
      event.preventDefault();

      // check status

      if (status === 'pending') {
        const comment = event?.target['nextNotes']?.value ?? 'Not Set';
        updateQueueEntry(status, provider, mappedQueueEntry?.uuid, 0, priorityComment, comment).then(
          () => {
            showToast({
              critical: true,
              title: t('updateEntry', 'Update entry'),
              kind: 'success',
              description: t('queueEntryUpdateSuccessfully', 'Queue Entry Updated Successfully'),
            });
            closeModal();
            // mutate();
          },
          (error) => {
            const errorMessages = extractErrorMessagesFromResponse(error);

            showNotification({
              title: t('queueEntryUpdateFailed', 'Error updating queue entry status'),
              kind: 'error',
              critical: true,
              description: errorMessages.join(','),
            });
          },
        );
      } else if (status === 'completed') {
        const comment = event?.target['nextNotes']?.value ?? 'Not Set';
        const nextQueueLocationUuid = event?.target['nextQueueLocation']?.value;

        updateQueueEntry(
          'Completed',
          provider,
          mappedQueueEntry?.uuid,
          contentSwitcherIndex,
          priorityComment,
          comment,
        ).then(
          () => {
            showToast({
              critical: true,
              title: t('endVisit', 'End Vist'),
              kind: 'success',
              description: t('endVisitSuccessfully', 'You have successfully ended patient visit'),
            });
            closeModal();
            // mutate();
          },
          (error) => {
            const errorMessages = extractErrorMessagesFromResponse(error);

            showNotification({
              title: t('queueEntryUpdateFailed', 'Error ending visit'),
              kind: 'error',
              critical: true,
              description: errorMessages.join(','),
            });
          },
        );

        addQueueEntry(
          '',
          nextQueueLocationUuid,
          patientUuid,
          selectedProvider,
          contentSwitcherIndex,
          '',
          'pending',
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
            const status = 'picked';
            updateQueueEntry(
              status,
              provider,
              mappedQueueEntry?.uuid,
              contentSwitcherIndex,
              priorityComment,
              'comment',
            ).then(
              () => {
                // view patient summary
                navigate({ to: `\${openmrsSpaBase}/home/patient-queues` });

                closeModal();
              },
              (error) => {
                const errorMessages = extractErrorMessagesFromResponse(error);

                showNotification({
                  title: t('queueEntryUpdateFailed', 'Error updating queue entry status'),
                  kind: 'error',
                  critical: true,
                  description: errorMessages.join(','),
                });
              },
            );

            closeModal();
            // mutate();
          },
          (error) => {
            const errorMessages = extractErrorMessagesFromResponse(error);

            showNotification({
              title: t('queueEntryUpdateFailed', 'Error updating queue entry status'),
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
      mappedQueueEntry?.uuid,
      patientUuid,
      priorityComment,
      provider,
      selectedLocation,
      selectedProvider,
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

          {status === 'completed' && (
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

          {status === 'completed' && (
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

          {status === 'completed' && (
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

          <Button type="submit">{status === 'pending' ? 'Save' : 'Move to the next queue room'}</Button>
        </ModalFooter>
      </Form>
    </div>
  );
};

export default ChangeStatusMoveToNext;
