import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MetricsCard from './cards/home-metrics-card.component';

import styles from './home-metrics.scss';

export interface Service {
  uuid: string;
  display: string;
}

function HomeMetricsCards() {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.cardContainer}>
        <MetricsCard
          label={t('registeredpatients', 'Registered Patients')}
          value={0}
          headerLabel={t('totalPatients', 'Total Patients')}
          service="scheduled"
        />
        <MetricsCard
          label={t('patients', 'Patients')}
          value={0}
          headerLabel={`${t('waitingFor', 'Waiting for')}:`}
          service="Patients"
        />
      </div>
    </>
  );
}

export default HomeMetricsCards;
