import { Calendar, Location } from '@carbon/react/icons';
import { formatDate, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useParentLocation } from '../active-visits/patient-queues.resource';
import styles from './patient-queue-header.scss';
import PatientQueueIllustration from './patient-queue-illustration.component';

const PatientQueueHeader: React.FC<{ title?: string }> = ({ title }) => {
  const { t } = useTranslation();
  const userSession = useSession();

  const userLocation = userSession?.sessionLocation?.display;

  const { location, isLoading: loading } = useParentLocation(userSession?.sessionLocation?.uuid);

  return (
    <>
      <div className={styles.header}>
        <div className={styles['left-justified-items']}>
          <PatientQueueIllustration />
          <div className={styles['page-labels']}>
            <p>{title ?? t('home', 'Home')}</p>
            <p className={styles['page-name']}>{t('queues', 'Patient Queues ')}</p>
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
          <div className={styles['clinic']}>
            <span>{location?.parentLocation?.display}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientQueueHeader;
