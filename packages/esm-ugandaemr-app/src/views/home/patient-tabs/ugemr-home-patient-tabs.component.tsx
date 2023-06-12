import React from 'react';
import { Tabs, Tab, Row, Column, TabList, TabPanels, TabPanel } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { OHRIHome, OHRIWelcomeSection, PatientListTable } from '@ohri/openmrs-esm-ohri-commons-lib';
import ActiveVisitsTable from '../../../../../esm-patient-queues-app/src/active-visits/active-visits-table.component'


function UgEmrPatientTabs() {
  const { t } = useTranslation();

  return (
    <Tabs type="container">
      <TabPanels>
        <TabPanel>
        <ActiveVisitsTable />
        {/* <PatientListTable/> */}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default UgEmrPatientTabs;
