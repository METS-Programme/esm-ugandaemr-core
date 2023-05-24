import React from 'react';
import { useTranslation } from 'react-i18next';
import { PatientChartProps } from '../../types';
import styles from '../common.scss';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import ClinicalAssessment from './tabs/hiv-clinical-assessment.component';
import DSDModel from './tabs/dsd-model.component';
import ARTSummary from "./tabs/hiv-summary.component";

const ArtDepartment: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const pageTitle = t('art', 'ART Department');

  return (
    <div className={styles.tabContainer}>
      <Tabs>
        <TabList contained>
          <Tab>{t('artSummary', 'ART Summary')}</Tab>
          <Tab>{t('clinicalAssessmentRegister', 'Clinical Assessment')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ARTSummary patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <ClinicalAssessment patientUuid={patientUuid} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default ArtDepartment;
