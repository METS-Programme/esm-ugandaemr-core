import React from 'react';
import styles from '../common.scss';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import { PatientChartProps } from '@ohri/openmrs-esm-ohri-commons-lib';
import DREnrollmentList from './tabs/dr-enrollment.component';
import DRFollowupList from './tabs/dr-followup.component';
import DSEnrollmentList from './tabs/ds-enrollment.component';
import DSFollowupList from './tabs/ds-followup.component';

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
            <DREnrollmentList patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <DRFollowupList patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <DSEnrollmentList patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <DSFollowupList patientUuid={patientUuid} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default TBTreatmentFollowUp;
