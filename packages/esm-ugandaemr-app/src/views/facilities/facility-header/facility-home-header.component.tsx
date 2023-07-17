import { Calendar, Location } from '@carbon/react/icons';
import { formatDate, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './facility-home-header.scss';
import FacilityHomeIllustration from './facility-home-illustration.component';

const FacilityHomeHeader: React.FC<{ title?: string }> = ({ title }) => {
  const { t } = useTranslation();
  const userSession = useSession();
  const userLocation = userSession?.sessionLocation?.display;

  return (
    <>
      <div className={styles.header}>
        <div className={styles['left-justified-items']}>
          <FacilityHomeIllustration />
          <div className={styles['page-labels']}>
            <p>{t('home', 'Facility')}</p>
            <p className={styles['page-name']}>{title ?? t('home', 'Facility Home')}</p>
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

export default FacilityHomeHeader;
