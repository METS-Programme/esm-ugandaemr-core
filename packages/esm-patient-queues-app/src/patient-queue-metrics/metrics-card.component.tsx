import { Layer, Tile } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './metrics-card.scss';

export interface Value {
  label: string;
  value: number;
  status?: Array<Status>;
}

interface Status {
  status: string;
  value: number;
  color: string;
}

interface MetricsCardProps {
  values: Array<Value>;
  headerLabel: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ values, headerLabel }) => {
  // Assuming "styles" is imported from a CSS module or styling library
  return (
    <Layer className={`${styles.cardWithChildren} ${styles.container}`}>
      <Tile className={styles.tileContainer}>
        <div className={styles.tileHeader}>
          <div className={styles.headerLabelContainer}>
            <label className={styles.headerLabel}>{headerLabel}</label>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {values.map((value) => (
            <div key={value.label}>
              <label className={styles.totalsLabel}>{value.label}</label>
              <p className={styles.totalsValue}>{value.value}</p>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {value?.status?.map((status, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'start',
                      marginRight: '10px',
                      color: `${status.color}`,
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '0.8em', marginRight: '5px' }}>{status.value}</p>
                    <label style={{ margin: 0, fontSize: '0.8em' }}>{status.status}</label>
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
