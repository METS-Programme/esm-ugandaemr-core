import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { showModal } from '@openmrs/esm-framework';

interface PatientMoveToNextServicePointProps {}

const PatientMovetoNextPoint: React.FC<PatientMoveToNextServicePointProps> = () => {
  const { t } = useTranslation();
  const openModal = useCallback(() => {
    const dispose = showModal('patient-move-to-next-service-point-modal', {
      closeModal: () => dispose(),
    });
  }, []);
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
