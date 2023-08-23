import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../common.scss';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import HTSTesting from './tabs/hts-testing.component';
import HIVScreening from './tabs/hiv-screening.component';

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
            <HIVScreening patientUuid={patientUuid} />
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
