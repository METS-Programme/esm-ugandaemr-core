import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PatientSearch from '../patient-search/patient-search.component';
import ActiveVisitsTable from './active-visits-table.component';
import styles from './active-visits-table.scss';
import LabResultsTable from '../lab-results/lab-results.component';
import { PRIVILEGE_CLINICIAN_QUEUE_LIST } from '../constants';
import { useSession, userHasAccess } from '@openmrs/esm-framework';

function ActiveVisitsTabs() {
  const { t } = useTranslation();
  const [showOverlay, setShowOverlay] = useState(false);
  const [view, setView] = useState('');
  const [viewState, setViewState] = useState<{ selectedPatientUuid: string }>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [overlayHeader, setOverlayTitle] = useState('');

  const session = useSession();

  const getTabStatus = (selectedIndex) => {
    return selectedIndex === 0 ? '' : 'COMPLETED';
  };

  return (
    <div className={styles.container}>
      <Tabs
        selectedIndex={selectedTab}
        onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}
        className={styles.tabs}
      >
        <TabList style={{ paddingLeft: '1rem' }} aria-label="Outpatient tabs" contained>
          <Tab>{t('pending', 'In Queue')}</Tab>
          {userHasAccess(PRIVILEGE_CLINICIAN_QUEUE_LIST, session.user) ? (
            <Tab>{t('investigations', 'Investigations')}</Tab>
          ) : (
            <></>
          )}
          <Tab>{t('completed', 'Completed')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel style={{ padding: 0 }}>
            <ActiveVisitsTable status={getTabStatus(selectedTab)} />
          </TabPanel>
          {userHasAccess(PRIVILEGE_CLINICIAN_QUEUE_LIST, session.user) ? (
            <TabPanel>
              <LabResultsTable />
            </TabPanel>
          ) : (
            <></>
          )}
          <TabPanel style={{ padding: 0 }}>
            <ActiveVisitsTable status={getTabStatus(selectedTab)} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {showOverlay && (
        <PatientSearch
          view={view}
          closePanel={() => setShowOverlay(false)}
          viewState={viewState}
          headerTitle={overlayHeader}
        />
      )}
    </div>
  );
}

export default ActiveVisitsTabs;
