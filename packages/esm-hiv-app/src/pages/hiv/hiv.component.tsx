import React from 'react';
import { useTranslation } from 'react-i18next';
import { PatientChartProps } from '../../types';
import styles from '../common.scss';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import HIVSummary from "./tabs/hvi-summary.component";
import ClinicalAssessment from "./tabs/clinical-assessment.component";

const HIVDepartment: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const pageTitle = t('HIV', 'HIV Department');

  return (
    <div className={styles.tabContainer}>
      <Tabs>
        <TabList contained>
          <Tab>{t('hivSummary', 'HIV Summary')}</Tab>
          <Tab>{t('clinicalAssessmentRegister', 'Clinical Assessment')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <HIVSummary patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <ClinicalAssessment patientUuid={patientUuid} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default HIVDepartment;
