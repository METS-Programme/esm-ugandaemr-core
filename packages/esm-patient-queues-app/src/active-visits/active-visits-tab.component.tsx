import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PatientSearch from '../patient-search/patient-search.component';
import ActiveVisitsTable from './active-visits-table.component';
import styles from './active-visits-table.scss';

function ActiveVisitsTabs() {
  const { t } = useTranslation();
  const [showOverlay, setShowOverlay] = useState(false);
  const [view, setView] = useState('');
  const [viewState, setViewState] = useState<{ selectedPatientUuid: string }>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [overlayHeader, setOverlayTitle] = useState('');

  return (
    <div className={styles.container}>
      {/* <div className={styles.headerBtnContainer}>
        <ExtensionSlot
          extensionSlotName="patient-search-button-slot"
          state={{
            buttonText: t('addPatientToQueue', 'Add patient to queue'),
            overlayHeader: t('addPatientToQueue', 'Add patient to queue'),
            buttonProps: {
              kind: 'secondary',
              renderIcon: (props) => <Add size={16} {...props} />,
              size: 'sm',
            },
            selectPatientAction: (selectedPatientUuid) => {
              setShowOverlay(true);
              setView(SearchTypes.SCHEDULED_VISITS);
              setViewState({ selectedPatientUuid });
              setOverlayTitle(t('addPatientWithAppointmentToQueue', 'Add patient with appointment to queue'));
            },
          }}
        />
      </div> */}
      <Tabs
        selectedIndex={selectedTab}
        onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}
        className={styles.tabs}
      >
        <TabList style={{ paddingLeft: '1rem' }} aria-label="Outpatient tabs" contained>
          <Tab>{t('incoming', 'Incoming')}</Tab>
          <Tab>{t('serving', 'Serving')}</Tab>
          <Tab>{t('outGooing', 'OutGoing')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel style={{ padding: 0 }}>
            <ActiveVisitsTable status={'pending'} />
          </TabPanel>
          <TabPanel style={{ padding: 0 }}>
            <ActiveVisitsTable status={'picked'} />
          </TabPanel>
          <TabPanel style={{ padding: 0 }}>
            <ActiveVisitsTable status={'completed'} />
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
