import React from 'react';
import PatientQueueHeader from './components/patient-queue-header/patient-queue-header.component';
import MetricsCard from './components/patient-queue-metrics/metrics-card.component';
import { useTranslation } from 'react-i18next';
import { QueueStatus } from './utils/utils';
import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@carbon/react';
import ActiveTriageVisitsTable from './active-visits/queue-patients-triage/queue-triage-table.component';
import styles from './queue-triage-home.scss';
import QueueSummaryTiles from './summary-tiles/queue-summary-tiles.component';

const TriageHome: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <PatientQueueHeader title="Triage" />
      <QueueSummaryTiles />

      <div className={styles.container}>
        <Tabs className={styles.tabs}>
          <TabList style={{ paddingLeft: '1rem' }} aria-label="triage outpatient tabs" contained>
            <Tab style={{ width: '150px' }}>{t('pending', 'In Queue')}</Tab>
            <Tab style={{ width: '150px' }}>{t('completed', 'Completed')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel style={{ padding: 0 }}>
              <ActiveTriageVisitsTable status={QueueStatus.Pending} />
            </TabPanel>
            <TabPanel style={{ padding: 0 }}>
              <ActiveTriageVisitsTable status={QueueStatus.Completed} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default TriageHome;
