import { Button } from '@carbon/react';
import { ArrowRight } from '@carbon/react/icons';
import React, { useCallback } from 'react';
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
    <Button
      kind="ghost"
      onClick={openModal}
      iconDescription={t('movePatient', 'Move Patient')}
      renderIcon={(props) => <ArrowRight size={16} {...props} />}
    />
  );
};
export default MovetoNextPointAction;
