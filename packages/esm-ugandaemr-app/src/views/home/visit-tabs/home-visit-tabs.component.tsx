import React, {useState} from 'react';
import { Tabs, Tab, Row, Column, TabList, TabPanels, TabPanel } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { Add } from '@carbon/react/icons';
// import ActiveVisitsList from './active-visits/home-active-visits.component';
import ActiveVisitsTable from '../../../../../esm-patient-queues-app/src//active-visits/active-visits-table.component'
import styles from '../visit-tabs/active-visits/home-active-visits.scss';
import { ExtensionSlot } from '@openmrs/esm-framework';
import { SearchTypes } from '../../../types';
import PatientSearch from '../../../../../esm-patient-queues-app/src/patient-search/patient-search.component';

function HomeVisitTabs() {
  const { t } = useTranslation();
  const [showOverlay, setShowOverlay] = useState(false);
  const [view, setView] = useState('');
  const [viewState, setViewState] = useState<{ selectedPatientUuid: string }>(null);
  const [overlayHeader, setOverlayTitle] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.headerBtnContainer}>
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
      </div>
      <Tabs type="container">
        <TabPanels>
          <TabList>
            <Tab>{t('Visits')}</Tab>
          </TabList>
          <TabPanel>
            {/* <ActiveVisitsList /> */}
            <ActiveVisitsTable/>
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

export default HomeVisitTabs;
