import { launchWorkspace } from "@openmrs/esm-framework";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import styles from "./death-notification-actions.scss";


const DeathNotificationActionsButton : React.FC = () => {
   const { t } = useTranslation();

  const handleLaunchWorkspace = useCallback(() => {
  launchWorkspace('patient-form-entry-workspace', {
    formInfo: {
      formUuid: 'bb282ac8-d8b6-4d76-88b9-86da83efec41',
    },
    workspaceTitle: 'Notification and Certification of Death',
  });
}, []);


  return (
    <li className="cds--overflow-menu-options__option">
      <button
        className={`cds--overflow-menu-options__btn ${styles.markDeadButton}`}
        role="menuitem"
        title={t('markDead', 'Mark Dead')}
        data-floating-menu-primary-focus
        onClick={() => handleLaunchWorkspace()}
      >
        <span className="cds--overflow-menu-options__option-content">{t('markDead', 'Mark Dead')}</span>
      </button>
    </li>
  );
}

export default DeathNotificationActionsButton;