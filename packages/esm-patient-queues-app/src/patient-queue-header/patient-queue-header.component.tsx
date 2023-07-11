import { Dropdown } from '@carbon/react';
import { Calendar, Location } from '@carbon/react/icons';
import { formatDate, useSession } from '@openmrs/esm-framework';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  updateSelectedQueueRoomLocationName,
  updateSelectedQueueRoomLocationUuid,
  useSelectedQueueRoomLocationName,
  useSelectedQueueRoomLocationUuid,
} from '../helpers/helpers';
import { useQueueRoomLocations } from '../patient-search/hooks/useQueueRooms';
import styles from './patient-queue-header.scss';
import PatientQueueIllustration from './patient-queue-illustration.component';

const PatientQueueHeader: React.FC<{ title?: string }> = ({ title }) => {
  const { t } = useTranslation();
  const userSession = useSession();
  const userLocation = userSession?.sessionLocation?.display;

  // queue rooms
  const { queueRoomLocations } = useQueueRoomLocations(userSession?.sessionLocation?.uuid);
  const currentQueueRoomLocationName = useSelectedQueueRoomLocationName();
  const currentQueueRoomLocationUuid = useSelectedQueueRoomLocationUuid();

  const [initialSelectedItem, setInitialSelectItem] = useState(() => {
    if (currentQueueRoomLocationName && currentQueueRoomLocationUuid) {
      return false;
    } else if (currentQueueRoomLocationName === t('all', 'All')) {
      return true;
    } else {
      return true;
    }
  });

  const handleQueueLocationChange = ({ selectedItem }) => {
    updateSelectedQueueRoomLocationUuid(selectedItem.uuid);
    updateSelectedQueueRoomLocationName(selectedItem.name);
    if (selectedItem.uuid == undefined) {
      setInitialSelectItem(true);
    } else {
      setInitialSelectItem(false);
    }
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles['left-justified-items']}>
          <PatientQueueIllustration />
          <div className={styles['page-labels']}>
            <p>{t('patientQueue', 'Patient queue')}</p>
            <p className={styles['page-name']}>{title ?? t('home', 'Home')}</p>
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
          <div className={styles.dropdown}>
            <label className={styles.view}>{t('view', 'View')}:</label>
            <Dropdown
              id="queueRooms"
              label={initialSelectedItem}
              type="inline"
              items={[{ display: `${t('all', 'All')}` }, ...queueRoomLocations]}
              itemToString={(item) => (item ? item.display : '')}
              onChange={handleQueueLocationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientQueueHeader;
