import React from 'react';
import { Tabs, Tab, Row, Column, TabList, TabPanels, TabPanel } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import ActiveVisitsTable from '../../../../../esm-patient-queues-app/src/active-visits/active-visits-table.component';

function UgEmrPatientTabs() {
  const { t } = useTranslation();

  return (
    <Tabs type="container">
      <TabPanels>
        <TabList>
          <Tab>{t('Active Visits')}</Tab>
        </TabList>
        <TabPanel>
          <ActiveVisitsTable />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default UgEmrPatientTabs;
