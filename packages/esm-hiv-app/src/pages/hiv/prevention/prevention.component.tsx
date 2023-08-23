import React from 'react';
import { useTranslation } from 'react-i18next'; 
import styles from '../common.scss';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import HivScreening from '../care-treatment/tabs/hiv-screening.component';
import HTSTesting from '../care-treatment/tabs/hts-testing.component';

export interface PatientChartProps {
  patientUuid: string;
}

const HIVPrevention: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const pageTitle = t('HIV', 'HIV Prevention');

  return (
    <div className={styles.tabContainer}>
      <Tabs>
        <TabList contained>
          <Tab>{t('hivScreening', 'HIV Screening')}</Tab>
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

export default HIVPrevention;
