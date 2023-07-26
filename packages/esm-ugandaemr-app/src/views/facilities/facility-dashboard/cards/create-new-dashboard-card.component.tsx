/* eslint-disable react-hooks/rules-of-hooks */
import { Layer, Tile } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './facility-dashboard-search-card.scss';

interface CreateNewDashboardProps {
  children?: React.ReactNode;
}

const CreateNewDashboardCard: React.FC<CreateNewDashboardProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <Layer className={`${children && styles.cardWithChildren} ${styles.container}`}>
      <Tile className={styles.tileContainer}>{children}</Tile>
    </Layer>
  );
};

export default CreateNewDashboardCard;
