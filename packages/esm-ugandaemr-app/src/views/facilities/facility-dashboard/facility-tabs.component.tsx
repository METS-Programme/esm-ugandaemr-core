import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Search, Tooltip } from '@carbon/react';
import styles from './facility-tabs.scss';
import DashboardSearchWidgetCard from './cards/facility-dashboard-search-card.component';
import { Add } from '@carbon/react/icons';
import { showModal } from '@openmrs/esm-framework';

const FacilityTabs: React.FC = () => {
  const { t } = useTranslation();

  const launchDashboardModal = useCallback(() => {
    const dispose = showModal('create-new-dashboard-ext', {
      closeModal: () => dispose(),
    });
  }, []);

  return (
    <>
      <div className={styles.cardContainer}>
        <>
          <DashboardSearchWidgetCard>
            <div className={styles.searchBox}>
              <section className={styles.section}>
                <div className={styles.sectionTitle}>
                  {t('searchItemDashboard', 'Search for item to add on the dashboard')}
                </div>
                <Search
                  placeholder="Search for visualizations (tables, graphs, reports and more)"
                  style={{ backgroundColor: 'white' }}
                />
              </section>
            </div>
            <div className={styles.createIcon}>
              <Tooltip align="bottom" label="Create New Dashboard">
                <Button
                  className={styles.iconButton}
                  kind="ghost"
                  onClick={launchDashboardModal}
                  iconDescription="Icon Description"
                  renderIcon={(props) => <Add {...props} width={60} height={60} />}
                />
              </Tooltip>
            </div>
          </DashboardSearchWidgetCard>
        </>
      </div>
    </>
  );
};

export default FacilityTabs;
