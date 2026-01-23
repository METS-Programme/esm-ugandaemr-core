import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { launchWorkspace2 } from '@openmrs/esm-framework';

interface MovetoNextServicePointPatientProps {
  patientUuid: string;
}

const MovetoNextServicePointPatientActionButton: React.FC<MovetoNextServicePointPatientProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const handleClick = useCallback(() => {
    launchWorkspace2('move-to-next-service-point-form-workspace', {
      patientUuid: patientUuid,
      showPatientHeader: true,
    });
  }, [t]);
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
