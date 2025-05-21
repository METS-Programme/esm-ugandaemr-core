import { launchWorkspace } from "@openmrs/esm-framework";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";


const DeathNotificationActionsButton : React.FC = () => {
   const { t } = useTranslation();

  const handleLaunchWorkspace = useCallback(() => {
  launchWorkspace('patient-form-entry-workspace', {
    formInfo: {
      formUuid: '00001ae1-1b37-41ca-adb2-17c04df008da',
    },
    workspaceTitle: 'Notification and Certification of Death',
  });
}, []);


  return (
    <li className="cds--overflow-menu-options__option">
      <button
        className="cds--overflow-menu-options__btn"
        role="menuitem"
        title={t('markDead', 'Mark Dead')}
        data-floating-menu-primary-focus
        onClick={() => handleLaunchWorkspace()}
        style={{
          maxWidth: '100vw',
        }}
      >
        <span className="cds--overflow-menu-options__option-content">{t('markDead', 'Mark Dead')}</span>
      </button>
    </li>
  );
}

export default DeathNotificationActionsButton;