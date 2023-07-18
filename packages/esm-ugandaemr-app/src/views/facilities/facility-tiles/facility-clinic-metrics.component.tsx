import { useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './facility-clinic-metrics.scss';
import FacilityMetricsCard from './facility-metrics-card.component';

export interface Service {
  uuid: string;
  display: string;
}

function FacilitiesMetrics() {
  const { t } = useTranslation();
  const userSession = useSession();

  return (
    <>
      <div className={styles.cardContainer}>
        <FacilityMetricsCard label={t('facilities', 'Facilities')} value={'--'} headerLabel={'No of Facilities'} />
        <FacilityMetricsCard label={t('facilities', 'Facilities')} value={'--'} headerLabel={'No of Facilities'} />
      </div>
    </>
  );
}

export default FacilitiesMetrics;
