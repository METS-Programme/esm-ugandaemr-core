import { Tab, TabList, TabPanel, TabPanels, Tabs, IconButton } from '@carbon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActiveVisitsTable from './active-visits-table.component';
import styles from './active-visits-table.scss';
import { QueueStatus } from '../utils/utils';
import PatientSearch from '../patient-search/patient-search.component';

function ActiveVisitsTabs() {
  const { t } = useTranslation();
  const [showOverlay, setShowOverlay] = useState(false);
  const [view, setView] = useState('');
  const [viewState, setViewState] = useState<{ selectedPatientUuid: string }>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [overlayHeader, setOverlayTitle] = useState('');

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
        <TabList style={{ paddingLeft: '1rem' }} aria-label="Outpatient tabs" contained>
          <Tab style={{ width: '150px' }}>{t('pending', 'In Queue')}</Tab>
          <Tab style={{ width: '150px' }}>{t('completed', 'Completed')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel style={{ padding: 0 }}>
            <ActiveVisitsTable status={getTabStatus(selectedTab)} />
          </TabPanel>
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
