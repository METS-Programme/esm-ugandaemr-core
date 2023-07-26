import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from '@carbon/react';
import styles from './facility-tabs.scss';
import DashboardSearchWidgetCard from './cards/facility-dashboard-search-card.component';
import { FaAmazon } from 'react-icons/fa';

const FacilityTabs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.cardContainer}>
        <>
          <DashboardSearchWidgetCard>
            <div className={styles.searchBox}>
              <Search className={styles.searchField} labelText="Search" placeholder="Search for a report" size="lg" />
            </div>
            <div>
              <FaAmazon className={styles.createIcon}/>
            </div>
          </DashboardSearchWidgetCard>
        </>
      </div>
    </>
  );
};

export default FacilityTabs;
