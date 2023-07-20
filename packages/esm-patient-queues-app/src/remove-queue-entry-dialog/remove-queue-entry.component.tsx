import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { parseDate, showNotification, showToast, toDateObjectStrict, toOmrsIsoString } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useVisitQueueEntries } from '../active-visits/active-visits-table.resource';
import { MappedQueueEntry } from '../types';
import { useVisit, voidQueueEntry } from './remove-queue-entry.resource';
import styles from './remove-queue-entry.scss';

interface RemoveQueueEntryDialogProps {
  queueEntry: MappedQueueEntry;
  closeModal: () => void;
}

const RemoveQueueEntryDialog: React.FC<RemoveQueueEntryDialogProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();
  const { currentVisit } = useVisit(queueEntry.patientUuid);
  const { mutate } = useVisitQueueEntries('', '');

  const removeQueueEntry = () => {
    const endCurrentVisitPayload = {
      location: currentVisit?.location?.uuid,
      startDatetime: parseDate(currentVisit?.startDatetime),
      visitType: currentVisit?.visitType?.uuid,
      stopDatetime: new Date(),
    };

    const endedAt = toDateObjectStrict(toOmrsIsoString(new Date()));

    voidQueueEntry(endedAt, endCurrentVisitPayload, queueEntry.id).then((response) => {
      closeModal();
      mutate();
      showToast({
        critical: true,
        kind: 'success',
        description: t('queueEntryRemovedSuccessfully', `Queue entry removed successfully`),
        title: t('queueEntryRemoved', 'Queue entry removed'),
      });
      (error) => {
        showNotification({
          title: t('removeQueueEntryError', 'Error removing queue entry'),
          kind: 'error',
          critical: true,
          description: error?.message,
        });
      };
    });
  };

  return (
    <div>
      <ModalHeader
        closeModal={closeModal}
        label={t('serviceQueue', 'Patient queue')}
        title={t('removeFromQueueAndEndVisit', 'Remove patient from queue and end active visit?')}
      />
      <ModalBody>
        <p className={styles.subHeading} id="subHeading">
          {t(
            'endVisitWarningMessage',
            'Ending this visit will remove this patient from the queue and will not allow you to fill another encounter form for this patient',
          )}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={removeQueueEntry}>
          {t('endVisit', 'End Visit')}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default RemoveQueueEntryDialog;
