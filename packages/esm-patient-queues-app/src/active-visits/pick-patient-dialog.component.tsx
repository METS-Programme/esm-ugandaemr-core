import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, ModalBody, ModalFooter, ModalHeader, InlineLoading } from '@carbon/react';
import {
  formatDate,
  navigate,
  parseDate,
  restBaseUrl,
  showNotification,
  showToast,
  useSession,
} from '@openmrs/esm-framework';

import { useTranslation } from 'react-i18next';
import { trimVisitNumber } from '../helpers/functions';
import { extractErrorMessagesFromResponse, handleMutate } from '../utils/utils';
import { PatientQueue } from '../types/patient-queues';
import { getCareProvider, updateQueueEntry } from './patient-queues.resource';

interface PickPatientDialogProps {
  queueEntry: PatientQueue;
  closeModal: () => void;
}

const PickPatientStatus: React.FC<PickPatientDialogProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();

  const sessionUser = useSession();

  const [isLoading, setIsLoading] = useState(true);

  const [provider, setProvider] = useState('');

  const [priorityComment, setPriorityComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const pickPatientQueueStatus = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        const status = 'Picked';
        await updateQueueEntry(status, provider, queueEntry?.uuid, 0, priorityComment, 'comment');

        showToast({
          critical: true,
          title: t('updateEntry', 'Update entry'),
          kind: 'success',
          description: t('queueEntryUpdateSuccessfully', 'Queue Entry Updated Successfully'),
        });

        navigate({ to: `\${openmrsSpaBase}/patient/${queueEntry?.patient?.uuid}/chart` });
        closeModal();
        handleMutate(`${restBaseUrl}/patientqueue`);
        setIsSubmitting(false);
      } catch (error: any) {
        setIsSubmitting(false);
        showNotification({
          title: t('queueEntryUpdateFailed', 'Error updating queue entry status'),
          kind: 'error',
          critical: true,
          description: error?.message,
        });
      }
    },
    [provider, queueEntry?.uuid, queueEntry?.patient?.uuid, priorityComment, t, closeModal],
  );

  if (queueEntry && Object.keys(queueEntry)?.length === 0) {
    return <ModalHeader closeModal={closeModal} title={t('patientNotInQueue', 'The patient is not in the queue')} />;
  }

  if (queueEntry && Object.keys(queueEntry)?.length > 0) {
    return (
      <div>
        {isLoading && <InlineLoading description={'Fetching Provider..'} />}

        <Form onSubmit={pickPatientQueueStatus}>
          <ModalHeader closeModal={closeModal} title={t('pickPatient', 'Pick Patient')} />
          <ModalBody>
            <h5>{queueEntry?.patient?.person?.display}</h5>
            <h5>VisitNo : {trimVisitNumber(queueEntry?.visitNumber)}</h5>
            <h5>
              Date Created :
              {formatDate(parseDate(queueEntry?.dateCreated), {
                time: true,
              })}
            </h5>
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={closeModal}>
              {t('cancel', 'Cancel')}
            </Button>

            {isSubmitting ? (
              <InlineLoading description={'Submitting...'} />
            ) : (
              <Button disabled={isLoading} type="submit">
                {t('pickPatient', 'Pick Patient')}
              </Button>
            )}
          </ModalFooter>
        </Form>
      </div>
    );
  }
};

export default PickPatientStatus;
