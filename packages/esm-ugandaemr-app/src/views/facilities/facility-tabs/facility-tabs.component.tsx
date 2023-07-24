import React from 'react';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import styles from '../../../views/facilities/facility-tabs/tabs/HIE/ug-emr-facilities.scss';
import { useTranslation } from 'react-i18next';
import FacilityAppointmentsTab from './tabs/Appointments/facility-appointments-tab.component';
import FacilityHtsTab from './tabs/hts/facility-hts-tab.component';
import FacilityCareAndTreatmentTab from './tabs/Care-And-Treatment/facility-care-and-treatment-tab.component';
import FacilitiesList from './tabs/HIE/facilities-list-component';

const FacilityTabs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.tabContainer}>
      <Tabs>
        <TabList contained>
          <Tab>{t('careAndTreatment', 'Care And Treatment')}</Tab>
          <Tab>{t('hts', 'HTS')}</Tab>
          <Tab>{t('apppointments', 'Apppointments')}</Tab>
          <Tab>{t('Facility List', 'Facility List')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FacilityCareAndTreatmentTab />
          </TabPanel>
          <TabPanel>
            <FacilityHtsTab />
          </TabPanel>
          <TabPanel>
            <FacilityAppointmentsTab />
          </TabPanel>
          <TabPanel>
            <FacilitiesList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default FacilityTabs;
