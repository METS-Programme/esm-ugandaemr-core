import React from 'react';
import { Tabs, Tab, Row, Column, TabList, TabPanels, TabPanel } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import AllPatientsList from './all-patients/ugemr-all-patient-list.components';
import ActivePatientsList from './active-patients/ugemr-active-patient-list.component';

function UgEmrPatientTabs() {
  const { t } = useTranslation();

  return (
    <Tabs type="container">
      <TabList contained>
        <Tab>{t('allPatients', 'All Patients')}</Tab>
        <Tab>{t('activePatients', 'Active Patients')}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ActivePatientsList />
        </TabPanel>
        <TabPanel>
          <AllPatientsList />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default UgEmrPatientTabs;
