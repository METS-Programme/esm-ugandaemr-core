import React, { useState, useCallback } from "react";
import { HeaderGlobalAction } from "@carbon/react";
import { Close, Notification, NotificationNew } from "@carbon/react/icons";
import styles from "./notifications-menu-button.scss";
import { useLayoutType } from "@openmrs/esm-framework";
import { useTranslation } from "react-i18next";
import NotificationMenuOverlay from "./notifications-menu-overlay.component";
import { useGetAlerts } from "./notifications-menu.resource";

const NotificationsMenuButton: React.FC = () => {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const { t } = useTranslation();
  const layout = useLayoutType();
  const { alerts } = useGetAlerts();

  const toggleNotificationPanel = useCallback(() => {
    setIsNotificationPanelOpen(!isNotificationPanelOpen);
  }, [isNotificationPanelOpen]);

  const hasUnreadAlerts = alerts.some((alert) => !alert.alertRead);

  return (
    <div className={styles.noficationButtonContainer}>
      {isNotificationPanelOpen && <NotificationMenuOverlay />}
      <HeaderGlobalAction
        aria-label={t("notifications", "Notifications")}
        aria-labelledby="Notifications Icon"
        className={`${
          isNotificationPanelOpen
            ? styles.activeNotificationButton
            : styles.notificationButton
        }`}
        onClick={toggleNotificationPanel}
      >
        {isNotificationPanelOpen ? (
          <Close size={20} />
        ) : hasUnreadAlerts ? (
          <NotificationNew size={20} />
        ) : (
          <Notification size={20} />
        )}
      </HeaderGlobalAction>
    </div>
  );
};

export default NotificationsMenuButton;
