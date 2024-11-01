import React, { useCallback } from 'react';

import { Button, Tooltip } from '@carbon/react';
import { Send } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { showModal } from '@openmrs/esm-framework';

interface MovetoNextPointActionProps {
  patientUuid: string;
}

const MovetoNextPointAction: React.FC<MovetoNextPointActionProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const openModal = useCallback(() => {
    const dispose = showModal('queue-table-move-to-next-service-point-modal', {
      patientUuid,
      closeModal: () => dispose(),
    });
  }, [patientUuid]);

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