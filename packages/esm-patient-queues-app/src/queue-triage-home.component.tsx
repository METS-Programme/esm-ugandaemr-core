import React, { useEffect, useState } from 'react';
import PatientQueueHeader from './components/patient-queue-header/patient-queue-header.component';
import { useTranslation } from 'react-i18next';
import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@carbon/react';
import ActiveTriageVisitsTable from './active-visits/queue-patients-triage/queue-triage-table.component';
import styles from './queue-triage-home.scss';
import QueueSummaryTiles from './summary-tiles/queue-summary-tiles.component';
import { useSession, userHasAccess } from '@openmrs/esm-framework';
import { APP_PATIENTQUEUE_TRIAGE_DASHBOARD } from './config/privileges';
import { QueueStatus } from './helpers/functions';

const TriageHome: React.FC = () => {
  const { t } = useTranslation();

  const [canViewDashboard, setCanViewDashboard] = useState(false);
  const userSession = useSession();
  useEffect(() => {
    setCanViewDashboard(userSession?.user && userHasAccess(APP_PATIENTQUEUE_TRIAGE_DASHBOARD, userSession.user));
  }, [userSession]);

  return (
    <div>
      <PatientQueueHeader title="Triage" />
      <QueueSummaryTiles />

      {/* table data */}

      {canViewDashboard && (
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
      )}
    </div>
  );
};

export default TriageHome;
