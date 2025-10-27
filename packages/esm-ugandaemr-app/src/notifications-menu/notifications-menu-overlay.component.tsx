import React, { useState } from "react";
import styles from "./notifications-menu-overlay.scss";
import { useTranslation } from "react-i18next";
import { InlineLoading, Toggle } from "@carbon/react";
import { useGetAlerts } from "./notifications-menu.resource";

const NotificationMenuOverlay: React.FC = () => {
  const { t } = useTranslation();
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const { alerts, isLoading, isError } = useGetAlerts();

  return (
    <div className={styles.notificationMenuOverlay}>
      <div className={styles.header}>
        <h2>{t("notifications", "Notifications")}</h2>
        <div className={styles.toggleContainer}>
          <Toggle
            labelText={t("onlyShowUnread", "Only show unread")}
            labelA={t("off", "Off")}
            labelB={t("on", "On")}
            size="sm"
            onToggle={(isToggled) => setShowOnlyUnread(isToggled)}
            defaultToggled={showOnlyUnread}
            id="toggle-1"
          />
        </div>
      </div>
      {isLoading ? (
        <InlineLoading
          status="active"
          iconDescription="Loading"
          description="Loading notifications..."
        />
      ) : alerts.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        <ul className={styles.notificationList}>
          {alerts
            .filter((notification) =>
              showOnlyUnread ? !notification.alertRead : true
            )
            .map((notification) => (
              <li
                key={notification.alertId}
                className={`${styles.notificationItem} ${
                  !notification.alertRead ? styles.unreadNotificationItem : ""
                }`}
              >
                <div className={styles.notificationIndicatorWrapper}>
                  {!notification.alertRead && (
                    <span className={styles.unreadIndicator}></span>
                  )}
                </div>
                <div className={styles.notificationContent}>
                  <p className={styles.description}>{notification.display}</p>
                  <span className={styles.time}>
                    {notification.timeDifference}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationMenuOverlay;
