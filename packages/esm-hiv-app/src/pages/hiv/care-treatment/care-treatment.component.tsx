import React from 'react';
import { useTranslation } from 'react-i18next'; 
import styles from '../common.scss';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import HivScreening from './tabs/hiv-screening.component';
import HTSTesting from './tabs/hts-testing.component';

export interface PatientChartProps {
  patientUuid: string;
}

const CareAndTreatment: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const pageTitle = t('HIV', 'HIV Department');

  return (
    <div className={styles.tabContainer}>
      <Tabs>
        <TabList contained>
          <Tab>{t('hivscreening', 'HIV Screening')}</Tab>
          <Tab>{t('htstesting', 'HTS Testing')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <HivScreening patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <HTSTesting patientUuid={patientUuid} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default CareAndTreatment;
