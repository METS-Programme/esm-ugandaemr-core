import { Button, Tooltip } from '@carbon/react';
import { Logout, Dashboard, ChooseItem, Notification } from '@carbon/react/icons';

import { showModal, useSession } from '@openmrs/esm-framework';
import React, { ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MappedPatientQueueEntry } from '../active-visits/patient-queues.resource';
import { usePatientsServed } from '../patient-queue-metrics/clinic-metrics.resource';
import ActionsMenu from './actions-menu.component';
import { PatientQueue } from '../types/patient-queues';

interface PickPatientActionMenuProps {
  queueEntry: MappedPatientQueueEntry;
  closeModal: () => void;
}

const PickPatientActionMenu: React.FC<PickPatientActionMenuProps> = ({ queueEntry }) => {
  const { t } = useTranslation();

  const session = useSession();

  const userLocation = session?.sessionLocation?.uuid;

  // check being served
  const { servedQueuePatients, servedCount } = usePatientsServed(userLocation, 'picked');

  const launchPickPatientQueueModal = useCallback(() => {
    if (servedCount === 1 || servedCount > 1) {
      const dispose = showModal('edit-queue-entry-status-modal', {
        closeModal: () => dispose(),
        queueEntry: servedQueuePatients,
        currentEntry: queueEntry,
      });
    } else {
      const dispose = showModal('pick-patient-queue-entry', {
        closeModal: () => dispose(),
        queueEntry,
      });
    }
  }, [queueEntry, servedCount, servedQueuePatients]);

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
