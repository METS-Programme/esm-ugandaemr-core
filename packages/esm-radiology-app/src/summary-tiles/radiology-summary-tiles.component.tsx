import { DataTableSkeleton } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './radiology-summary-tiles.scss';
import { useMetrics } from './radiology-summary.resource';
import SummaryTile from './summary-tile.component';

const RadiologySummaryTiles: React.FC = () => {
  const { t } = useTranslation();
  const { metrics, isError, isLoading } = useMetrics();

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />;
  }

  return (
    <>
      <div className={styles.cardContainer}>
        <SummaryTile
          label={t('orders', 'Orders')}
          value={metrics.orders}
          headerLabel={t('radiologyOrders', 'Radiology Orders')}
        />
        <SummaryTile
          label={t('today', 'Today')}
          value={metrics.completed_orders}
          headerLabel={t('completedOrders', 'Orders completed today')}
        />
        <SummaryTile
          label={t('last14Days', 'Last 14 days')}
          value={metrics.missed_collections}
          headerLabel={t('missedOrders', 'Orders missed')}
        />
      </div>
    </>
  );
};

export default RadiologySummaryTiles;
