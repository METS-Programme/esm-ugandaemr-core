import { Button } from '@carbon/react';
import { ArrowRight } from '@carbon/react/icons';

import { showModal } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MappedPatientQueueEntry } from '../active-visits/patient-queues.resource';

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
    <Button
      kind="ghost"
      onClick={launchNextQueueModal}
      iconDescription={t('moveToNextQueueRoom', 'Move to Next Queue Room ')}
      renderIcon={(props) => <ArrowRight size={16} {...props} />}
    >
      {t('sendToNextRoom', 'Send To Next Room')}
    </Button>
  );
};

export default ActionsMenu;
