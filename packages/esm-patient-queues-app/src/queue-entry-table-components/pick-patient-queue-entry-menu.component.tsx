import { Button, Tooltip } from '@carbon/react';
import { Logout, Dashboard, ChooseItem } from '@carbon/react/icons';

import { showModal } from '@openmrs/esm-framework';
import React, { ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MappedPatientQueueEntry } from '../active-visits/patient-queues.resource';

interface PickPatientActionMenuProps {
  queueEntry: MappedPatientQueueEntry;
  closeModal: () => void;
}

const PickPatientActionMenu: React.FC<PickPatientActionMenuProps> = ({ queueEntry }) => {
  const { t } = useTranslation();

  const launchPickPatientQueueModal = useCallback(() => {
    const dispose = showModal('pick-patient-queue-entry', {
      closeModal: () => dispose(),
      queueEntry,
    });
  }, [queueEntry]);

  return (
    <Tooltip align="bottom" label="Pick Patient">
      <Button
        kind="ghost"
        onClick={launchPickPatientQueueModal}
        iconDescription={t('pickPatient', 'Pick Patient ')}
        renderIcon={(props) => <ChooseItem size={16} {...props} />}
      ></Button>
    </Tooltip>
  );
};

export default PickPatientActionMenu;
