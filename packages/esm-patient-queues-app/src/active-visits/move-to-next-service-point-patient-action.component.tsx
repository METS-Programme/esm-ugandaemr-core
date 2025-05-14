import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { launchWorkspace } from '@openmrs/esm-framework';
import { PatientQueue } from '../types/patient-queues';

interface PatientMoveToNextServicePointPatientActionProps {
  queueEntry?: PatientQueue;
}

const MovetoNextServicePointPatientActionButton: React.FC<PatientMoveToNextServicePointPatientActionProps> = ({
  queueEntry,
}) => {
  const { t } = useTranslation();
  const handleClick = useCallback(() => {
    launchWorkspace('move-to-next-service-point-form-workspace', {
      workspaceTitle: t('moveToNextServicePoint', 'Move to next service point'),
      queueEntry: queueEntry,
    });
  }, [queueEntry, t]);
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
