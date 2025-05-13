import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { launchWorkspace, showModal } from '@openmrs/esm-framework';

interface PatientMoveToNextServicePointProps {
  patientUuid?: string;
}

const MovetoNextServicePointPatientActionButton: React.FC<PatientMoveToNextServicePointProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const handleClick = useCallback(() => {
    launchWorkspace('move-to-next-service-point-form-workspace', {
      workspaceTitle: t('moveToNextServicePoint', 'Move to next service point'),
      patientUuid,
    });
  }, [patientUuid]);
  return (
    <li className="cds--overflow-menu-options__option">
      <button
        className="cds--overflow-menu-options__btn"
        role="menuitem"
        title={t('moveToNext', 'Move to Next Service Point')}
        data-floating-menu-primary-focus
        onClick={handleClick}
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
export default MovetoNextServicePointPatientActionButton;
