import React from 'react';
import PatientQueueHeader from './components/patient-queue-header/patient-queue-header.component';
import MetricsCard from './components/patient-queue-metrics/metrics-card.component';
import { useTranslation } from 'react-i18next';
import { QueueStatus } from './utils/utils';
import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@carbon/react';
import ActiveTriageVisitsTable from './active-visits/queue-patients-triage/queue-triage-table.component';
import styles from './queue-triage-home.scss';

const TriageHome: React.FC = () => {
  const { t } = useTranslation();

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
