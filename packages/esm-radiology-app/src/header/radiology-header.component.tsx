import { Calendar, Location } from '@carbon/react/icons';
import { formatDate, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './radiology-header.scss';
import RadiologyIllustration from './radiology-illustration.component';

export const RadiologyHeader: React.FC = () => {
  const { t } = useTranslation();
  const userSession = useSession();
  const userLocation = userSession?.sessionLocation?.display;

  return (
    <div className={styles.header}>
      <div className={styles['left-justified-items']}>
        <RadiologyIllustration />
        <div className={styles['page-labels']}>
          <p className={styles['page-name']}>{t('radiology', 'Radiology')} </p>
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
  );
};
