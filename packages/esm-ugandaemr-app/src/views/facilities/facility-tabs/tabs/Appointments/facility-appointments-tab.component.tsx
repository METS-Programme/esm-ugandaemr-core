import React from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import styles from './appointments.scss';

const FacilityAppointmentsTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.tabContainer}>
      <span> Coming Soon!!(Under Devlopment)</span>
    </div>
  );
};

export default FacilityAppointmentsTab;
