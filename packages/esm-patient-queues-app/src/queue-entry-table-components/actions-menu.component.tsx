import { Button } from '@carbon/react';
import { Logout } from '@carbon/react/icons';

import { showModal } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PatientQueue } from '../types/patient-queues';

interface ActionsMenuProps {
  queueEntry: PatientQueue;
  closeModal: () => void;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ queueEntry }) => {
  const { t } = useTranslation();

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
      renderIcon={(props) => <Logout size={16} {...props} />}
    />
  );
};

export default ActionsMenu;
