import React, { useState } from 'react';

import PatientQueueHeader from './components/patient-queue-header/patient-queue-header.component';
import MetricsCard from './components/patient-queue-metrics/metrics-card.component';
import { useTranslation } from 'react-i18next';
import { useSession } from '@openmrs/esm-framework';
import styles from './components/patient-queue-metrics/clinic-metrics.scss';
import { useParentLocation } from './active-visits/patient-queues.resource';
import { QueueStatus } from './utils/utils';
import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@carbon/react';
import ActiveTriageVisitsTable from './active-visits/active-visits-patients-triage/active-visits-triage-table.component';

const TriageHome: React.FC = () => {
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState(0);

  const getTabStatus = (selectedIndex) => {
    return selectedIndex === 0 ? '' : QueueStatus.Completed;
  };

  return (
    <div>
      <PatientQueueHeader title="Triage" />
      <div className={styles.cardContainer}>
        <MetricsCard values={[{ label: 'In Queue', value: 0 }]} headerLabel={t('inQueueTriage', 'Patients Waiting')} />
        <MetricsCard
          values={[{ label: t('byTriage', 'By you'), value: 0 }]}
          headerLabel={t('pendingTriageServing', 'Patients waiting to be Served')}
        />
        <MetricsCard
          values={[{ label: 'Patients Served', value: 0 }]}
          headerLabel={t('noOfPatientsServed', 'No. of Patients Served')}
        />
      </div>

      <div className={styles.container}>
        <Tabs
          selectedIndex={selectedTab}
          onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}
          className={styles.tabs}
        >
          <TabList style={{ paddingLeft: '1rem' }} aria-label="triage outpatient tabs" contained>
            <Tab style={{ width: '150px' }}>{t('pending', 'In Queue')}</Tab>
            <Tab style={{ width: '150px' }}>{t('completed', 'Completed')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel style={{ padding: 0 }}>
              <ActiveTriageVisitsTable status={getTabStatus(selectedTab)} />
            </TabPanel>
            <TabPanel style={{ padding: 0 }}>
              <ActiveTriageVisitsTable status={getTabStatus(selectedTab)} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default TriageHome;
