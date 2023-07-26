/* eslint-disable no-restricted-imports */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DefinitionTooltip, Search, Tag } from '@carbon/react';
import styles from './facility-tabs.scss';
import DashboardSearchWidgetCard from './cards/facility-dashboard-search-card.component';
import { Add } from '@carbon/icons-react';

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
            <div className={styles.createIcon}>
              <DefinitionTooltip className={styles.tooltip} align="bottom-left" definition={'Create New Dashboard'}>
                <Tag role="tooltip">
                  <span>
                    <Add size="34" />
                  </span>
                </Tag>
              </DefinitionTooltip>
            </div>
          </DashboardSearchWidgetCard>
        </>
      </div>
    </>
  );
};

export default FacilityTabs;
