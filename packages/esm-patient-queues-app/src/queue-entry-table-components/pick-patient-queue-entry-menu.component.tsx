import { Button, Tooltip } from '@carbon/react';
import { Logout, Dashboard, ChooseItem, Notification } from '@carbon/react/icons';

import { showModal, useSession } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MappedPatientQueueEntry } from '../active-visits/patient-queues.resource';
import { usePatientsServed } from '../patient-queue-metrics/clinic-metrics.resource';

interface PickPatientActionMenuProps {
  queueEntry: MappedPatientQueueEntry;
  closeModal: () => void;
}

const PickPatientActionMenu: React.FC<PickPatientActionMenuProps> = ({ queueEntry }) => {
  const { t } = useTranslation();

  const session = useSession();

  const { servedQueuePatients } = usePatientsServed(session?.sessionLocation?.uuid, 'picked');

  const filteredByProvider = servedQueuePatients.filter((item) => item?.provider === session?.user?.systemId);

  const launchPickPatientQueueModal = useCallback(() => {
    if (filteredByProvider.length === 1 || filteredByProvider.length > 0) {
      const dispose = showModal('edit-queue-entry-status-modal', {
        closeModal: () => dispose(),
        queueEntry: filteredByProvider[0],
        currentEntry: queueEntry,
      });
    } else {
      const dispose = showModal('pick-patient-queue-entry', {
        closeModal: () => dispose(),
        queueEntry,
      });
    }
  }, [filteredByProvider, queueEntry]);

  return (
    <Tooltip align="bottom" label="Pick Patient">
      <Button
        kind="ghost"
        onClick={launchPickPatientQueueModal}
        iconDescription={t('pickPatient', 'Pick Patient ')}
        renderIcon={(props) => <Notification size={16} {...props} />}
      ></Button>
    </Tooltip>
  );
};

export default PickPatientActionMenu;
