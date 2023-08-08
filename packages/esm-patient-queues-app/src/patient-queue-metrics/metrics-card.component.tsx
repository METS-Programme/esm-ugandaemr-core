import { Layer, Tile } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './metrics-card.scss';

interface MetricsCardProps {
  label: string;
  value: number | string;
  headerLabel: string;
  children?: React.ReactNode;
  service?: string;
  serviceUuid?: string;
  locationUuid?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  label,
  value,
  headerLabel,
  children,
  service,
  serviceUuid,
  locationUuid,
}) => {
  const { t } = useTranslation();

  return (
    <Layer className={`${children && styles.cardWithChildren} ${styles.container}`}>
      <Tile className={styles.tileContainer}>
        <div className={styles.tileHeader}>
          <div className={styles.headerLabelContainer}>
            <label className={styles.headerLabel}>{headerLabel}</label>
            {children}
          </div>
        </div>
        <div>
          <label className={styles.totalsLabel}>{label}</label>
          <p className={styles.totalsValue}>{value}</p>
        </div>
      </Tile>
    </Layer>
  );
};

export default MetricsCard;
