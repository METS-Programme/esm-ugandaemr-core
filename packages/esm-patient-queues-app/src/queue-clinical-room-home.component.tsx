import React, { useState } from 'react';

import PatientQueueHeader from './components/patient-queue-header/patient-queue-header.component';
import { useTranslation } from 'react-i18next';
import { QueueStatus } from './utils/utils';
import ActiveClinicalVisitsTable from './active-visits/queue-patients-clinical/queue-clinical-table.component';
import styles from './active-visits/active-visits-table.scss';
import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@carbon/react';

const ClinicalRoomHome: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);

  const getTabStatus = (selectedIndex) => {
    return selectedIndex === 0 ? '' : QueueStatus.Completed;
  };
  return (
    <div>
      <PatientQueueHeader title="Clinical Room" />
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
    </div>
  );
};

export default ClinicalRoomHome;
