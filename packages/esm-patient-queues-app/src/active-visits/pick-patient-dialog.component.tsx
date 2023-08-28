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

import { navigate, showNotification, showToast, useLocations, useSession } from '@openmrs/esm-framework';
import isEmpty from 'lodash-es/isEmpty';

import { getCareProvider, updateQueueEntry, useVisitQueueEntries } from './active-visits-table.resource';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueueRoomLocations } from '../patient-search/hooks/useQueueRooms';
import { MappedQueueEntry } from '../types';

import styles from './change-status-dialog.scss';
import { trimVisitNumber } from '../helpers/functions';

interface PickPatientDialogProps {
  queueEntry: MappedQueueEntry;
  closeModal: () => void;
}

const PickPatientStatus: React.FC<PickPatientDialogProps> = ({ queueEntry, closeModal }) => {
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

  const pickPatientQueueStatus = useCallback(
    (event) => {
      event.preventDefault();

      updateQueueEntry(provider, queueEntry?.id, priorityComment, 'comment').then(
        () => {
          showToast({
            critical: true,
            title: t('updateEntry', 'Update entry'),
            kind: 'success',
            description: t('queueEntryUpdateSuccessfully', 'Queue Entry Updated Successfully'),
          });

          navigate({ to: `\${openmrsSpaBase}/patient/${queueEntry.patientUuid}/chart` });

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
    [provider, queueEntry?.id, queueEntry.patientUuid, priorityComment, t, closeModal, mutate],
  );

  if (Object.keys(queueEntry)?.length === 0) {
    return <ModalHeader closeModal={closeModal} title={t('patientNotInQueue', 'The patient is not in the queue')} />;
  }

  if (Object.keys(queueEntry)?.length > 0) {
    return (
      <div>
        <Form onSubmit={pickPatientQueueStatus}>
          <ModalHeader closeModal={closeModal} title={t('pickPatient', 'Pick Patient')} />
          <ModalBody>
            <h5>{queueEntry.name}</h5>
            <h5>VisitNo : {trimVisitNumber(queueEntry.visitNumber)}</h5>
            <h5>Date Created : {queueEntry.dateCreated}</h5>
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={closeModal}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button type="submit">{t('pickPatient', 'Pick Patient')}</Button>
          </ModalFooter>
        </Form>
      </div>
    );
  }
};

export default PickPatientStatus;
