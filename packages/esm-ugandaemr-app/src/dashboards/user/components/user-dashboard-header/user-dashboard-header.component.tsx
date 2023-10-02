import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Location } from '@carbon/react/icons';
import { formatDate, useSession } from '@openmrs/esm-framework';
import ReportingHomeIllustration from './user-dashboard-illustration.component';
import styles from './user-dashboard-header.scss';

const UserDashboardHeader: React.FC<{ title?: string }> = ({ title }) => {
  const { t } = useTranslation();
  const userSession = useSession();
  const userLocation = userSession?.sessionLocation?.display;

  return (
    <>
      <div className={styles.header}>
        <div className={styles['left-justified-items']}>
          <ReportingHomeIllustration />
          <div className={styles['page-labels']}>
            <p>{t('home', 'Home')}</p>
            <p className={styles['page-name']}>{title ?? t('user-dashboard', 'User Dashboard')}</p>
          </div>
        </div>
        <div className={styles['right-justified-items']}>
          <div className={styles['date-and-location']}>
            <Location size={16} />
            <span className={styles.value}>{userLocation}</span>
            <span className={styles.middot}>&middot;</span>
            <Calendar size={16} />
            <span className={styles.value}>{formatDate(new Date(), { mode: 'standard' })}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboardHeader;
