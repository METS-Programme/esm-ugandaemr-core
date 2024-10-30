import React, { useState } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import ActiveVisitsTable from './active-visits-table.component';
import styles from './active-visits-table.scss';
import { QueueStatus } from '../utils/utils';
import ActiveClinicalVisitsTable from './active-visits-patients-clinical/active-visits-clinical-table.component';

const ActiveClinicalVisitsTabs = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);

  const getTabStatus = (selectedIndex) => {
    return selectedIndex === 0 ? '' : QueueStatus.Completed;
  };

  return (
    <div className={styles.container}>
      <Tabs
        selectedIndex={selectedTab}
        onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}
        className={styles.tabs}
      >
        <TabList style={{ paddingLeft: '1rem' }} aria-label="clinical outpatient tabs" contained>
          <Tab style={{ width: '150px' }}>{t('pending', 'In Queue')}</Tab>
          <Tab style={{ width: '150px' }}>{t('completed', 'Completed')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel style={{ padding: 0 }}>
            <ActiveClinicalVisitsTable status={getTabStatus(selectedTab)} />
          </TabPanel>
          <TabPanel style={{ padding: 0 }}>
            <ActiveClinicalVisitsTable status={getTabStatus(selectedTab)} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default ActiveClinicalVisitsTabs;
