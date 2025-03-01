import { Button } from '@carbon/react';
import { Notification } from '@carbon/react/icons';
import { showModal, useSession } from '@openmrs/esm-framework';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PatientQueue } from '../types/patient-queues';
import { usePatientQueuePages } from '../active-visits/patient-queues.resource';
import { QueueEnumStatus, QueueStatus } from '../utils/utils';

interface PickPatientActionMenuProps {
  queueEntry: PatientQueue;
  closeModal: () => void;
}

const PickPatientActionMenu: React.FC<PickPatientActionMenuProps> = ({ queueEntry }) => {
  const { t } = useTranslation();
  const session = useSession();
  const sessionLocationId = session?.sessionLocation?.uuid;
  const providerId = session?.user?.systemId;

  // Fetch patient queue with status "Picked"
  const { items } = usePatientQueuePages(sessionLocationId, QueueStatus.Picked);

  // Filter by provider
  const filteredByProvider = useMemo(
    () =>
      items?.filter((item) => item?.provider?.identifier === providerId && item.status === QueueEnumStatus.PICKED) ||
      [],
    [items, providerId],
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
