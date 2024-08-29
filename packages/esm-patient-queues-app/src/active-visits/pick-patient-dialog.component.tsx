import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Form, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import {
  formatDate,
  navigate,
  parseDate,
  showNotification,
  showToast,
  useLocations,
  useSession,
} from '@openmrs/esm-framework';

import { getCareProvider, updateQueueEntry } from './active-visits-table.resource';
import { useTranslation } from 'react-i18next';
import { useQueueRoomLocations } from '../hooks/useQueueRooms';
import { MappedQueueEntry } from '../types';
import { trimVisitNumber } from '../helpers/functions';
import { useProviders } from '../visit-form/queue.resource';
import { extractErrorMessagesFromResponse } from '../utils/utils';

interface PickPatientDialogProps {
  queueEntry: MappedQueueEntry;
  closeModal: () => void;
}

const PickPatientStatus: React.FC<PickPatientDialogProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();

  let isCancelled = false;

  const sessionUser = useSession();

  const { queueRoomLocations, mutate } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);

  const [provider, setProvider] = useState('');

  const [priorityComment, setPriorityComment] = useState('');

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
  }, [sessionUser?.user?.uuid, mutate, isCancelled]);

  useEffect(() => {
    return () => {
      isCancelled = true;
    };
  }, [isCancelled]);

  useEffect(() => providerUuid, [providerUuid]);

  const pickPatientQueueStatus = useCallback(
    (event) => {
      event.preventDefault();

      const status = 'Picked';
      updateQueueEntry(status, provider, queueEntry?.id, 0, priorityComment, 'comment').then(
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

  if (queueEntry && Object.keys(queueEntry)?.length === 0) {
    return <ModalHeader closeModal={closeModal} title={t('patientNotInQueue', 'The patient is not in the queue')} />;
  }

  if (queueEntry && Object.keys(queueEntry)?.length > 0) {
    return (
      <div>
        <Form onSubmit={pickPatientQueueStatus}>
          <ModalHeader closeModal={closeModal} title={t('pickPatient', 'Pick Patient')} />
          <ModalBody>
            <h5>{queueEntry.name}</h5>
            <h5>VisitNo : {trimVisitNumber(queueEntry.visitNumber)}</h5>
            <h5>
              Date Created :
              {formatDate(parseDate(queueEntry.dateCreated), {
                time: true,
              })}
            </h5>
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
