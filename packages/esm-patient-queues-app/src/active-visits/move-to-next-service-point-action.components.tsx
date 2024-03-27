import { showModal } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface PatientMoveToNextServicePointProps {
  patientUuid: string;
}

const PatientMovetoNextPoint: React.FC<PatientMoveToNextServicePointProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const openModal = useCallback(() => {
    const dispose = showModal('patient-move-to-next-service-point-modal', {
      patientUuid,
      closeModal: () => dispose(),
    });
  }, [patientUuid]);
  return (
    <li className="cds--overflow-menu-options__option">
      <button
        className="cds--overflow-menu-options__btn"
        role="menuitem"
        title={t('moveToNext', 'Move to Next Service Point')}
        data-floating-menu-primary-focus
        onClick={openModal}
        style={{
          maxWidth: '100vw',
        }}
      >
        <span className="cds--overflow-menu-options__option-content">
          {t('moveToNext', 'Move to Next Service Point')}
        </span>
      </button>
    </li>
  );
};
export default PatientMovetoNextPoint;
