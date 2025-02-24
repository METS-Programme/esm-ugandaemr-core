import React, { useCallback } from 'react';

import { Button, Tooltip } from '@carbon/react';
import { Send } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { showModal } from '@openmrs/esm-framework';
import { PatientQueue } from '../types/patient-queues';

interface MovetoNextPointActionProps {
  patientUuid: string;
  entries: Array<PatientQueue>;
}

const MovetoNextPointAction: React.FC<MovetoNextPointActionProps> = ({ patientUuid, entries }) => {
  const { t } = useTranslation();

  const openModal = useCallback(() => {
    const dispose = showModal('queue-table-move-to-next-service-point-modal', {
      patientUuid,
      entries,
      closeModal: () => dispose(),
    });
  }, [patientUuid, entries]);

  return (
    <Tooltip label="Re-Assign">
      <Button
        kind="ghost"
        onClick={openModal}
        iconDescription={t('reassignPatient', 'ReAssign Patient')}
        renderIcon={(props) => <Send size={16} {...props} />}
      />
    </Tooltip>
  );
};
export default MovetoNextPointAction;
