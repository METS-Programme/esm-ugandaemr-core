import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, ModalBody, ModalFooter, ModalHeader, InlineLoading } from '@carbon/react';
import { formatDate, navigate, parseDate, showNotification, showToast, useSession } from '@openmrs/esm-framework';

import { getCareProvider, updateQueueEntry } from './active-visits-table.resource';
import { useTranslation } from 'react-i18next';
import { MappedQueueEntry } from '../types';
import { trimVisitNumber } from '../helpers/functions';
import { extractErrorMessagesFromResponse } from '../utils/utils';

interface PickPatientDialogProps {
  queueEntry: MappedQueueEntry;
  closeModal: () => void;
}

const PickPatientStatus: React.FC<PickPatientDialogProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();

  const sessionUser = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [provider, setProvider] = useState('');

  const handleError = (title, error) => {
    const errorMessages = extractErrorMessagesFromResponse(error);
    showNotification({
      title,
      kind: 'error',
      critical: true,
      description: errorMessages.join(',') || error?.message,
    });
  };

  const fetchProvider = useCallback(async () => {
    if (!sessionUser?.user?.uuid) return;

    setIsLoading(true);

    try {
      const response = await getCareProvider(sessionUser?.user?.uuid);
      const uuid = response?.data?.results?.[0]?.uuid;

      if (!uuid) throw new Error('Provider UUID not found');

      setProvider(uuid);
    } catch (error) {
      handleError("Couldn't get provider", error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionUser?.user?.uuid]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  const pickPatientQueueStatus = useCallback(
    async (event) => {
      event.preventDefault();

      if (!queueEntry?.id || !queueEntry?.patientUuid) {
        handleError(t('invalidQueueEntry', 'Invalid queue entry'), new Error('Queue entry data is missing'));
        return;
      }

      const status = 'Picked';
      setIsSubmitting(true);

      try {
        await updateQueueEntry(status, provider, queueEntry.id, 0, '', 'comment');

        showToast({
          critical: true,
          title: t('updateEntry', 'Update entry'),
          kind: 'success',
          description: t('queueEntryUpdateSuccessfully', 'Queue Entry Updated Successfully'),
        });
        navigate({ to: `${window.getOpenmrsSpaBase()}/patient/${queueEntry.patientUuid}/chart` });
        closeModal();
      } catch (error) {
        handleError(t('queueEntryUpdateFailed', 'Error updating queue entry status'), error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [provider, queueEntry?.id, queueEntry?.patientUuid, t, closeModal],
  );

  if (!queueEntry || Object.keys(queueEntry)?.length === 0) {
    return <ModalHeader closeModal={closeModal} title={t('patientNotInQueue', 'The patient is not in the queue')} />;
  }

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

          {isLoading ? (
            <InlineLoading description={'Fetching Provider...'} />
          ) : (
            <Button disabled={isSubmitting || isLoading} type="submit">
              {isSubmitting ? t('submitting', 'Submitting...') : t('pickPatient', 'Pick Patient')}
            </Button>
          )}
        </ModalFooter>
      </Form>
    </div>
  );
};

export default PickPatientStatus;



