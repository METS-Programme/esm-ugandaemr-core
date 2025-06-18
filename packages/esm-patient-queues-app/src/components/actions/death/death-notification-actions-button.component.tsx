import { launchWorkspace } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './death-notification-actions.scss';
import { DeathNotificationEncounterType_UUID, DeathNotificationForm_UUID } from '../../../constants';
import { mutate } from 'swr';

interface DeathNotificationProps {
  patientUuid: string;
}

const DeathNotificationActionsButton: React.FC<DeathNotificationProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const handleLaunchWorkspace = useCallback(() => {
    launchWorkspace('patient-form-entry-workspace', {
      formInfo: {
        encounterTypeUuid: DeathNotificationEncounterType_UUID,
        formUuid: DeathNotificationForm_UUID,
        patientUuid,
      },
      workspaceTitle: 'Notification and Certification of Death',
      mutateForm: mutate,
    });
  }, [patientUuid]);

  return (
    <li className="cds--overflow-menu-options__option">
      <button
        className={`cds--overflow-menu-options__btn ${styles.markDeadButton}`}
        role="menuitem"
        title={t('markPatientDeceased', 'Mark Patient Deceased')}
        data-floating-menu-primary-focus
        onClick={() => handleLaunchWorkspace()}
      >
        <span className="cds--overflow-menu-options__option-content">
          {t('markPatientDeceased', 'Mark Patient Deceased')}
        </span>
      </button>
    </li>
  );
};

export default DeathNotificationActionsButton;
