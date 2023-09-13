import React from 'react';
import styles from '../common.scss';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import { PatientChartProps } from '@ohri/openmrs-esm-ohri-commons-lib';
import DRTBEnrollmentList from './tabs/dr-enrollment.component';
import DRTBFollowupList from './tabs/dr-followup.component';
import DSTBEnrollmentList from './tabs/ds-enrollment.component';
import DSTBFollowupList from './tabs/ds-followup.component';

const TBTreatmentFollowUp: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tabContainer}>
      <Tabs>
        <TabList contained>
          <Tab>{t('dsEnrollment')}</Tab>
          <Tab>{t('dsFollowup')}</Tab>
          <Tab>{t('drEnrollment')}</Tab>
          <Tab>{t('drFollowup')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DSTBEnrollmentList patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <DSTBFollowupList patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <DRTBEnrollmentList patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <DRTBFollowupList patientUuid={patientUuid} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default TBTreatmentFollowUp;
