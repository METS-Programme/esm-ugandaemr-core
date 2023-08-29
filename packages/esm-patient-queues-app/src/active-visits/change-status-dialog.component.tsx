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

import { showNotification, showToast, useLocations, useSession } from '@openmrs/esm-framework';

import { getCareProvider, updateQueueEntry, useVisitQueueEntries } from './active-visits-table.resource';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueueRoomLocations } from '../patient-search/hooks/useQueueRooms';
import { MappedQueueEntry } from '../types';

import styles from './change-status-dialog.scss';

interface ChangeStatusDialogProps {
  queueEntry?: MappedQueueEntry;
  closeModal: () => void;
}

const ChangeStatus: React.FC<ChangeStatusDialogProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();

  const locations = useLocations();

  const [selectedLocation, setSelectedLocation] = useState('');

  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(1);

  const [statusSwitcherIndex, setStatusSwitcherIndex] = useState(1);

  const [status, setStatus] = useState('');

  const [selectedQueueLocation, setSelectedQueueLocation] = useState(queueEntry?.queueLocation);

  const { mutate } = useVisitQueueEntries('', selectedQueueLocation);

  const sessionUser = useSession();

  const { queueRoomLocations } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);

  const [provider, setProvider] = useState('');
  const [priorityComment, setPriorityComment] = useState('');

  useEffect(() => {
    getCareProvider(sessionUser?.user?.username).then(
      (response) => {
        showToast({
          critical: true,
          title: t('gotProvider', `Got Provider`),
          kind: 'success',
          description: t('getProvider', `Got Provider ${response?.data?.results[0].uuid}`),
        });
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
        setStatus('Pending');
        break;
      }
      case 1: {
        setStatus('Picked');
        break;
      }
      case 2: {
        setStatus('Finished');
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

  // endVisit
  const endVisitStatus = useCallback(
    (event) => {
      event.preventDefault();
      const comment = event?.target['nextNotes']?.value ?? 'Not Set';
      const status = 'Completed';
      updateQueueEntry(status, provider, queueEntry?.id, priorityComment, comment).then(
        () => {
          showToast({
            critical: true,
            title: t('endVisit', 'End Vist'),
            kind: 'success',
            description: t('endVisitSuccessfully', 'You have successfully ended patient visit'),
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
    },
    [closeModal, mutate, priorityComment, provider, queueEntry?.id, t],
  );

  // change to picked
  const changeQueueStatus = useCallback(
    (event: { preventDefault: () => void; target: { [x: string]: { value: string } } }) => {
      event.preventDefault();
      const comment = event?.target['nextNotes']?.value ?? 'Not Set';
      const status = 'Picked';
      updateQueueEntry(status, provider, queueEntry?.id, priorityComment, comment).then(
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
    },
    [provider, queueEntry?.id, priorityComment, t, closeModal, mutate],
  );

  if (queueEntry && Object.keys(queueEntry)?.length === 0) {
    return <ModalHeader closeModal={closeModal} title={t('patientNotInQueue', 'The patient is not in the queue')} />;
  }

  if (queueEntry && Object.keys(queueEntry)?.length > 0) {
    return (
      <div>
        <Form onSubmit={changeQueueStatus}>
          <ModalHeader
            closeModal={closeModal}
            title={t(
              'whatWouldyouLiketodo',
              `You are  currently serving ${queueEntry.name} What would you like to do with this patient?`,
            )}
          />
          <ModalBody>
            <div className={styles.modalBody}>
              <h5>
                {queueEntry.name} &nbsp; · &nbsp;{queueEntry.patientSex} &nbsp; · &nbsp;{queueEntry.patientAge}&nbsp;
                {t('years', 'Years')}
              </h5>
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
            <section>
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

            <section>
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
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={closeModal}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button kind="danger" onClick={endVisitStatus}>
              {t('endVisit', 'End Visit')}
            </Button>
            <Button type="submit">{t('moveToNextQueue', 'Move to next queue room')}</Button>
          </ModalFooter>
        </Form>
      </div>
    );
  }
};

export default ChangeStatus;
