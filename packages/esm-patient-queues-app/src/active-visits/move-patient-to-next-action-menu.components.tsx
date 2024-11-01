import React, { useCallback } from 'react';

import { Button, Tooltip } from '@carbon/react';
import { Send } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { showModal } from '@openmrs/esm-framework';

interface MovetoNextPointActionProps {
  patient: string;
  entries: [];
}

const MovetoNextPointAction: React.FC<MovetoNextPointActionProps> = ({ patient, entries }) => {
  const { t } = useTranslation();

  // console.log('am here doo ', patient);
  // console.log('am here doo ', entries);

  const openModal = useCallback(() => {
    const dispose = showModal('queue-table-move-to-next-service-point-modal', {
      patient,
      entries,
      closeModal: () => dispose(),
    });
  }, [patient, entries]);

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
