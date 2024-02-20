import { Layer, Tile } from '@carbon/react';
import React from 'react';
import styles from './metrics-card.scss';

export interface Value {
  label: string;
  value: number;
  status?: Array<Status>;
}

interface Status {
  status: any;
  value: number;
  color: string;
}

interface MetricsCardProps {
  values: Array<Value>;
  headerLabel: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ values, headerLabel }) => {
  return (
    <Layer className={`${styles.cardWithChildren} ${styles.container}`}>
      <Tile className={styles.tileContainer}>
        <div className={styles.tileHeader}>
          <div className={styles.headerLabelContainer}>
            <label className={styles.headerLabel}>{headerLabel}</label>
          </div>
        </div>
        <div className={styles.valueContainer}>
          {values.map((value) => (
            <div className={styles.valueInnerContainer}>
              <div key={value.label}>
                <label className={styles.totalsLabel}>{value.label}</label>
                <p className={styles.totalsValue}>{value.value}</p>
              </div>
              <div className={styles.valueStatus}>
                {value?.status?.map((status, index) => (
                  <div key={index} className={styles.status}>
                    <p className={styles.statusValue}>{status.value}</p>
                    <label
                      className={`${styles.statusLabel} ${
                        status.color === 'orange'
                          ? styles.statusOrange
                          : status.color === 'green'
                          ? styles.statusGreen
                          : styles.statusBlue
                      }`}
                    >
                      {status.status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Tile>
    </Layer>
  );
};

export default MetricsCard;
