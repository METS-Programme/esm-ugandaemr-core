import { Button } from '@carbon/react';
import { Notification } from '@carbon/react/icons';
import { showModal, showSnackbar, useSession } from '@openmrs/esm-framework';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PatientQueue } from '../types/patient-queues';
import { usePatientQueuePages } from './patient-queues.resource';
import { QueueEnumStatus, QueueStatus } from '../utils/utils';

interface PickPatientActionMenuProps {
  queueEntry: PatientQueue;
  closeModal: () => void;
}

const PickQueuePatientActionButton: React.FC<PickPatientActionMenuProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();
  const { sessionLocation, user } = useSession() || {};
  const sessionLocationId = sessionLocation?.uuid;
  const providerId = user?.systemId;

  const { items: pickedQueueItems } = usePatientQueuePages(sessionLocationId, QueueStatus.Picked);

  const hasPickedPatient = useMemo(() => {
    if (!pickedQueueItems || !providerId) return false;
    return pickedQueueItems.some(
      (item) => item?.provider?.identifier === providerId && item?.status === QueueEnumStatus.PICKED,
    );
  }, [pickedQueueItems, providerId]);

  const launchPickPatientQueueModal = useCallback(() => {
    if (hasPickedPatient) {
      showSnackbar({
        title: t('alreadyPickedPatient', 'You have already picked a patient'),
        subtitle: t('completeCurrentPatient', 'Please complete the current one before picking another'),
        kind: 'error',
        autoClose: true,
      });
      return;
    }

    if (queueEntry.status !== QueueEnumStatus.PENDING) {
      showSnackbar({
        title: t('invalidStatus', 'Patient cannot be picked'),
        subtitle: t('onlyPendingAllowed', 'Only patients in PENDING status can be picked'),
        kind: 'error',
        autoClose: true,
      });
      return;
    }

    const dispose = showModal('pick-patient-queue-entry', {
      queueEntry,
      closeModal: () => {
        dispose();
        closeModal?.();
      },
    });
  }, [hasPickedPatient, queueEntry, t, closeModal]);

  return (
    <Button
      kind="ghost"
      onClick={launchPickPatientQueueModal}
      iconDescription={t('pickPatient', 'Pick Patient')}
      renderIcon={(props) => <Notification size={16} {...props} />}
    />
  );
};

export default PickQueuePatientActionButton;
