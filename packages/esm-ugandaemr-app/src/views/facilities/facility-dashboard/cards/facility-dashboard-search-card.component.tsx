import { Tile, Layer } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './facility-dashboard-search-card.scss';

interface FacilityDashboardMetricsProps {
  children?: React.ReactNode;
}

const DashboardSearchWidgetCard: React.FC<FacilityDashboardMetricsProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <Layer className={`${children && styles.cardWithChildren} ${styles.container}`}>
      <Tile className={styles.tileContainer}>{children}</Tile>
    </Layer>
  );
};

export default DashboardSearchWidgetCard;
