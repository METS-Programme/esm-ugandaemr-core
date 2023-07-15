import { Dropdown } from '@carbon/react';
import { Calendar, Location } from '@carbon/react/icons';
import { formatDate, useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  updateSelectedQueueLocationName,
  updateSelectedQueueLocationUuid,
  updateSelectedServiceName,
  useSelectedFacilityName,
  useSelectedQueueLocationName,
} from '../../../../../esm-patient-queues-app/src/helpers/helpers';
import PatientQueueIllustration from '../../../../../esm-patient-queues-app/src/patient-queue-header/patient-queue-illustration.component';
import { useQueueLocations } from '../../../../../esm-patient-queues-app/src/patient-search/hooks/useQueueLocations';
import styles from './patient-home-header.scss';

const PatientHomeHeader: React.FC<{ title?: string }> = ({ title }) => {
  const { t } = useTranslation();
  const userSession = useSession();
  const userLocation = userSession?.sessionLocation?.display;
  const { queueLocations } = useQueueLocations();
  const currentQueueLocationName = useSelectedQueueLocationName();
  const currentFacilityName  = useSelectedFacilityName();

  const handleQueueLocationChange = ({ selectedItem }) => {
    updateSelectedQueueLocationUuid(selectedItem.id);
    updateSelectedQueueLocationName(selectedItem.name);
    updateSelectedServiceName('All');
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles['left-justified-items']}>
          <PatientQueueIllustration />
          <div className={styles['page-labels']}>
            {/* <p>{t('patientQueue', 'Patient queue')}</p> */}
            <p className={styles['page-name']}>{title ?? t('home', 'Home')}</p>
          </div>
        </div>
        <div className={styles['right-justified-items']}>
          <div className={styles['date-and-location']}>
            <div>{currentFacilityName} </div>
            <span className={styles.middot}>&middot;</span>
            <Location size={16} />
            <span className={styles.value}>{userLocation}</span>
            <span className={styles.middot}>&middot;</span>
            <Calendar size={16} />
            <span className={styles.value}>{formatDate(new Date(), { mode: 'standard' })}</span>
          </div>
          <div className={styles.dropdown}>
            <label className={styles.view}>{t('view', 'View')}:</label>
            <Dropdown
              id="typeOfCare"
              label={currentQueueLocationName ?? queueLocations?.[0]?.name}
              items={[{ display: `${t('all', 'All')}` }, ...queueLocations]}
              itemToString={(item) => (item ? item.name : '')}
              type="inline"
              onChange={handleQueueLocationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientHomeHeader;
