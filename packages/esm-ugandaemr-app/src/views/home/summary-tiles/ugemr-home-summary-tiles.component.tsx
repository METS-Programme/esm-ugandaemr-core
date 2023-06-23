import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MetricsCard from '../summary-tiles/cards/home-metrics-card.component';

import styles from './ugemr-home-summary-tiles.scss';

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
          label={t('patients', 'Patients')}
          value={0}
          headerLabel={t('checkedInPatients', 'Checked in patients')}
          service="scheduled"
        />
        <MetricsCard
          label={t('patients', 'Patients')}
          value={0}
          headerLabel={`${t('waitingFor', 'Waiting for')}:`}
          service="Patients"
        />

        <MetricsCard
          label={t('minutes', 'Minutes')}
          value={0}
          headerLabel={t('averageWaitTime', 'Average wait time today')}
          service="waitTime"
        />
      </div>
    </>
  );
}

export default HomeMetricsCards;
