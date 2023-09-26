import { Layer, Tile } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './metrics-card.scss';

interface Value {
  label: string;
  value: number;
}

interface MetricsCardProps {
  values: Array<Value>;
  headerLabel: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ values, headerLabel }) => {
  const { t } = useTranslation();

  return (
    <Layer className={`${styles.cardWithChildren} ${styles.container}`}>
      <Tile className={styles.tileContainer}>
        <div className={styles.tileHeader}>
          <div className={styles.headerLabelContainer}>
            <label className={styles.headerLabel}>{headerLabel}</label>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          {values.map((value) => {
            return (
              <div style={{ margin: '5px' }}>
                <label className={styles.totalsLabel}>{value.label}</label>
                <p className={styles.totalsValue}>{value.value}</p>
              </div>
            );
          })}
        </div>
      </Tile>
    </Layer>
  );
};

export default MetricsCard;
