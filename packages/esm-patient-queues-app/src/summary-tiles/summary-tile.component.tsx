import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tile } from '@carbon/react';
import styles from './summary-tile.scss';

export interface KeyPerformanceIndicator {
  value: any;
  label: string;
}

interface SummaryTileProps {
  label: string;
  value: number;
  headerLabel: string;
  children?: React.ReactNode;
  additionalKpis?: Array<KeyPerformanceIndicator>;
}

const SummaryTile: React.FC<SummaryTileProps> = ({ label, value, headerLabel, children, additionalKpis }) => {
  const { t } = useTranslation();

  return (
    <Tile className={styles.tileContainer} light={true}>
      <div className={styles.tileHeader}>
        <div className={styles.headerLabelContainer}>
          <label className={styles.headerLabel}>{headerLabel}</label>
          {children}
        </div>
        <div></div>
      </div>
      <div className={styles.kpis}>
        <div>
          <label className={styles.totalsLabel}>{label}</label>
          <p className={styles.totalsValue}>{value}</p>
        </div>
        {additionalKpis?.map((p) => (
          <div>
            <label className={styles.totalsLabel}>{p.label}</label>
            <p className={styles.totalsValue}>{p.value}</p>
          </div>
        ))}
      </div>
    </Tile>
  );
};

export default SummaryTile;
