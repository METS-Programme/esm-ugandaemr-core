import React, { useEffect, useState } from 'react';

import PatientQueueHeader from './components/patient-queue-header/patient-queue-header.component';
import { useTranslation } from 'react-i18next';
import ActiveClinicalVisitsTable from './active-visits/queue-patients-clinical/queue-clinical-table.component';
import styles from './active-visits/active-visits-table.scss';
import { Tabs, TabPanel, TabList, Tab, TabPanels } from '@carbon/react';
import QueueSummaryTiles from './summary-tiles/queue-summary-tiles.component';
import { useSession, userHasAccess } from '@openmrs/esm-framework';
import { APP_PATIENTQUEUE_CLINICIAN_DASHBOARD } from './config/privileges';
import { QueueStatus } from './helpers/functions';

const ClinicalRoomHome: React.FC = () => {
  const { t } = useTranslation();

  const [canViewDashboard, setCanViewDashboard] = useState(false);
  const userSession = useSession();
  useEffect(() => {
    setCanViewDashboard(userSession?.user && userHasAccess(APP_PATIENTQUEUE_CLINICIAN_DASHBOARD, userSession.user));
  }, [userSession]);

  return (
    <div>
      <PatientQueueHeader title="Clinical Room" />
      <QueueSummaryTiles />

      {/* table data */}

      {canViewDashboard && (
        <div className={styles.container}>
          <Tabs className={styles.tabs}>
            <TabList style={{ paddingLeft: '1rem' }} aria-label="clinical outpatient tabs" contained>
              <Tab style={{ width: '150px' }}>{t('pending', 'In Queue')}</Tab>
              <Tab style={{ width: '150px' }}>{t('completed', 'Completed')}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel style={{ padding: 0 }}>
                <ActiveClinicalVisitsTable status={QueueStatus.Pending} />
              </TabPanel>
              <TabPanel style={{ padding: 0 }}>
                <ActiveClinicalVisitsTable status={QueueStatus.Completed} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ClinicalRoomHome;
