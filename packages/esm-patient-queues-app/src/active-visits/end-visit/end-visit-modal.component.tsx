import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, ModalBody, ModalFooter, ModalHeader, InlineLoading } from '@carbon/react';
import styles from './end-visit-modal.scss';
import { useTranslation } from 'react-i18next';
import {
  getCoreTranslation,
  getSessionStore,
  navigate,
  parseDate,
  restBaseUrl,
  showNotification,
  showSnackbar,
  useSession,
  useVisit,
} from '@openmrs/esm-framework';
import {
  getCareProvider,
  getCurrentPatientQueueByPatientUuid,
  updateQueueEntry,
  updateVisit,
} from '../patient-queues.resource';
import { QueueStatus, extractErrorMessagesFromResponse, handleMutate } from '../../utils/utils';

interface EndVisitConfirmationProps {
  patientUuid: string;
  closeModal: () => void;
}

const EndVisitConfirmation: React.FC<EndVisitConfirmationProps> = ({ closeModal, patientUuid }) => {
  const { t } = useTranslation();

  const [isFetchingProvider, setIsFetchingProvider] = useState(false);

  const [isEndingVisit, setIsEndingVisit] = useState(false);

  const priorityLabels = useMemo(() => ['Not Urgent', 'Urgent', 'Emergency'], []);

  const [provider, setProvider] = useState('');

  const { activeVisit } = useVisit(patientUuid);

  const sessionUser = useSession();

  // Memoize the function to fetch the provider using useCallback
  const fetchProvider = useCallback(() => {
    if (!sessionUser?.user?.uuid) return;

    setIsFetchingProvider(true);

    getCareProvider(sessionUser?.user?.uuid).then(
      (response) => {
        const uuid = response?.data?.results[0].uuid;
        setIsFetchingProvider(false);
        setProvider(uuid);
      },
      (error) => {
        const errorMessages = extractErrorMessagesFromResponse(error);
        setIsFetchingProvider(false);
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

  const handleEndVisit = async () => {
  setIsEndingVisit(true);

  const endVisitPayload = {
    location: activeVisit?.location?.uuid,
    startDatetime: parseDate(activeVisit?.startDatetime),
    visitType: activeVisit?.visitType?.uuid,
    stopDatetime: new Date(),
  };

  try {
    let hasEndedVisit = false;
    let hasEndedQueue = false;
    let queueEntry;

    // 1. Attempt to end the visit if it exists
    if (activeVisit?.uuid) {
      const visitResponse = await updateVisit(activeVisit.uuid, endVisitPayload);
      if (visitResponse.status === 200) {
        hasEndedVisit = true;
      }
    }

    // 2. Get queue entry and end it if found
    const queueResponse = await getCurrentPatientQueueByPatientUuid(
      patientUuid,
      sessionUser?.sessionLocation?.uuid,
    );

    const queues = queueResponse?.data?.results?.[0]?.patientQueues || [];
    queueEntry = queues.find((item) => item?.patient?.uuid === patientUuid);

    if (queueEntry) {
      await updateQueueEntry(
        QueueStatus.Completed,
        provider,
        queueEntry.uuid,
        0,
        priorityLabels[0],
        'visit-ended',
      );
      hasEndedQueue = true;
    }

    // 3. If anything was ended, proceed with navigation and feedback
    if (hasEndedVisit || hasEndedQueue) {
      let navigateTo = `${window.getOpenmrsSpaBase()}home`;

      if (queueEntry) {
        const roles = getSessionStore().getState().session?.user?.roles || [];
        const hasClinicianRole = roles.some((role) => role?.display === 'Organizational: Clinician');
        const hasTriageRole = roles.some((role) => role?.display === 'Triage');

        if (hasClinicianRole) {
          navigateTo = `${window.getOpenmrsSpaBase()}home/clinical-room-patient-queues`;
        } else if (hasTriageRole) {
          navigateTo = `${window.getOpenmrsSpaBase()}home/triage-patient-queues`;
        }
      }

      closeModal();
      navigate({ to: navigateTo });
      handleMutate(`${restBaseUrl}/patientqueue`);
      setIsEndingVisit(false);

      showSnackbar({
        title: hasEndedVisit ? 'Visit Ended' : 'Queue Completed',
        subtitle: t(
          hasEndedVisit && hasEndedQueue
            ? 'endedSuccessfully'
            : hasEndedVisit
            ? 'visitEndedOnly'
            : 'queueEndedOnly',
          hasEndedVisit && hasEndedQueue
            ? 'Visit and queue ended successfully'
            : hasEndedVisit
            ? 'Visit ended successfully'
            : 'Queue ended successfully',
        ),
        kind: 'success',
      });
    } else {
      // Nothing was ended
      closeModal();
      setIsEndingVisit(false);
      showSnackbar({
        title: 'No Action Taken',
        subtitle: t('noVisitOrQueueToEnd', 'No active visit or queue found to end.'),
        kind: 'info',
      });

    }
  } catch (error) {
    closeModal();
    setIsEndingVisit(false);
    const errorMessages = extractErrorMessagesFromResponse(error);
    showNotification({
      title: t('endVisit', 'Error ending visit'),
      kind: 'error',
      critical: true,
      description: errorMessages.join(','),
    });
  }
};


  return (
    <Form>
      {isFetchingProvider && <InlineLoading status="active" description="Is Fetching" />}
      <ModalHeader closeModal={close} className={styles.modalHeader}>
        {t('endVisit', 'End Visit')}?
      </ModalHeader>
      <ModalBody>
        <p className={styles.bodyText}>
          {t('endVisitText', `Are you sure you want to end this visit? This action can't be undone.`)}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button size="lg" kind="secondary" onClick={closeModal}>
          {getCoreTranslation('cancel')}
        </Button>
        <Button autoFocus kind="danger" onClick={handleEndVisit} size="lg" disabled={isEndingVisit}>
          {isEndingVisit ? (
            <InlineLoading description={t('endingVisit', 'Ending visit...')} />
          ) : (
            t('endAVisit', 'End a visit')
          )}
        </Button>
      </ModalFooter>
    </Form>
  );
};

export default EndVisitConfirmation;
