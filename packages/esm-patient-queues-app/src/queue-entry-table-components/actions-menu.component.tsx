import { Layer, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { navigate, showModal } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MappedPatientQueueEntry } from '../active-visits/patient-queues.resource';
import styles from './actions-menu.scss';

interface ActionsMenuProps {
  queueEntry: MappedPatientQueueEntry;
  closeModal: () => void;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ queueEntry }) => {
  const { t } = useTranslation();

  const launchEndVisitModal = useCallback(() => {
    const dispose = showModal('remove-queue-entry', {
      closeModal: () => dispose(),
      queueEntry,
    });
  }, [queueEntry]);

  const launchNextQueueModal = useCallback(() => {
    const dispose = showModal('edit-queue-entry-status-modal', {
      closeModal: () => dispose(),
      queueEntry,
    });
  }, [queueEntry]);

  return (
    <Layer>
      <OverflowMenu ariaLabel="Actions menu" selectorPrimaryFocus={'#editPatientDetails'} size="sm" flipped>
        <OverflowMenuItem
          className={styles.menuItem}
          id="#editPatientDetails"
          itemText={t('editPatientDetails', 'Edit patient details')}
          onClick={() =>
            navigate({
              to: `\${openmrsSpaBase}/patient/${queueEntry.patientUuid}/edit`,
            })
          }
        >
          {t('editPatientDetails', 'Edit patient details')}
        </OverflowMenuItem>
        <OverflowMenuItem
          className={styles.menuItem}
          id="#endVisit"
          onClick={launchEndVisitModal}
          hasDivider
          isDelete
          itemText={t('endVisit', 'End visit')}
        >
          {t('endVisit', 'End Visit')}
        </OverflowMenuItem>
        <OverflowMenuItem
          className={styles.menuItem}
          id="#sendToNext"
          onClick={launchNextQueueModal}
          hasDivider
          itemText={t('sendToNext', 'Send to Next Queue Room')}
        >
          {t('sendToNext', 'Send to Next Queue Room')}
        </OverflowMenuItem>
      </OverflowMenu>
    </Layer>
  );
};

export default ActionsMenu;
