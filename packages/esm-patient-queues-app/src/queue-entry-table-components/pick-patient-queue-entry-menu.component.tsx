import { Button } from '@carbon/react';
import { Notification } from '@carbon/react/icons';

import { showModal, useSession } from '@openmrs/esm-framework';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePatientsServed } from '../components/patient-queue-metrics/clinic-metrics.resource';
import { PatientQueue } from '../types/patient-queues';

interface PickPatientActionMenuProps {
  queueEntry: PatientQueue;
  closeModal: () => void;
}

const PickPatientActionMenu: React.FC<PickPatientActionMenuProps> = ({ queueEntry }) => {
  const { t } = useTranslation();
  const session = useSession();
  const sessionLocationId = session?.sessionLocation?.uuid;
  const providerId = session?.user?.systemId;

  const { servedQueuePatients } = usePatientsServed(sessionLocationId, 'picked');
  const filteredByProvider = useMemo(
    () => servedQueuePatients?.filter((item) => item?.provider === providerId) || [],
    [servedQueuePatients, providerId],
  );

  const launchPickPatientQueueModal = useCallback(() => {
    const modalType = filteredByProvider.length > 0 ? 'edit-queue-entry-status-modal' : 'pick-patient-queue-entry';
    const modalProps =
      filteredByProvider.length > 0 ? { queueEntry: filteredByProvider[0], currentEntry: queueEntry } : { queueEntry };

    const dispose = showModal(modalType, { ...modalProps, closeModal: () => dispose() });
  }, [filteredByProvider, queueEntry]);

  return (
    <Button
      kind="ghost"
      onClick={launchPickPatientQueueModal}
      iconDescription={t('pickPatient', 'Pick Patient')}
      renderIcon={(props) => <Notification size={16} {...props} />}
    />
  );
};

export default PickPatientActionMenu;
