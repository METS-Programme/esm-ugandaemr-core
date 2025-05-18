import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, InlineLoading } from '@carbon/react';
import styles from './end-visit-modal.scss';
import { useTranslation } from 'react-i18next';
import { getCoreTranslation, showSnackbar } from '@openmrs/esm-framework';

type EndVisitStatus = 'inactive' | 'active' | 'finished' | 'error';

interface EndVisitConfirmationProps {
  uuid: string;
  patientUuid: string;
}

const EndVisitConfirmation: React.FC<EndVisitConfirmationProps> = ({ uuid, patientUuid }) => {
  const { t } = useTranslation();

  const [endVisitStatus, setEndVisitStatus] = useState<EndVisitStatus>('inactive');

  const isEndingVisit = endVisitStatus === 'active';

  const handleEndVisit = async () => {
    setEndVisitStatus('active');
    try {
      // TODO: Call your API to end the visit
      // await endVisit(uuid, patientUuid);

      setEndVisitStatus('finished');
      showSnackbar({
        title: 'Visit Ended',
        subtitle: t('endVisitError', 'Failed to end visit'),
        kind: 'error',
      });
      // Optional: wait briefly before closing modal or resetting state
      setTimeout(() => {
        close(); // or reset state
        setEndVisitStatus('inactive');
      }, 1000);
    } catch (error) {
      setEndVisitStatus('error');
      showSnackbar({
        title: 'Visit Ended',
        subtitle: t('endVisitError', 'Failed to end visit'),
        kind: 'error',
      });
      // Optional: reset to allow retry
      setTimeout(() => {
        setEndVisitStatus('inactive');
      }, 2000);
    }
  };

  return (
    <Modal>
      <ModalHeader closeModal={close} className={styles.modalHeader}>
        {t('endVisit', 'End Visit')}?
      </ModalHeader>
      <ModalBody>
        <p className={styles.bodyText}>
          {t('endVisitText', `Are you sure you want to end this visit? This action can't be undone.`)}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button size="lg" kind="secondary" disabled={isEndingVisit}>
          {getCoreTranslation('cancel')}
        </Button>

        <Button autoFocus kind="danger" onClick={handleEndVisit} size="lg" disabled={isEndingVisit}>
          {endVisitStatus !== 'inactive' ? (
            <InlineLoading
              description={
                endVisitStatus === 'active'
                  ? t('endingVisit', 'Ending visit...')
                  : endVisitStatus === 'finished'
                  ? t('visitEnded', 'Visit ended')
                  : t('visitEndError', 'Failed to end visit')
              }
              status={endVisitStatus}
            />
          ) : (
            t('endAVisit', 'End a visit')
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EndVisitConfirmation;
