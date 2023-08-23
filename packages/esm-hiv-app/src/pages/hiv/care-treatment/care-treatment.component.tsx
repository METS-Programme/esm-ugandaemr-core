import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../common.scss';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import HIVSummary from './tabs/hvi-summary.component';
import ClinicalAssessment from './tabs/clinical-assessment.component';

export interface PatientChartProps {
  patientUuid: string;
}

const CareAndTreatment: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const pageTitle = t('careTreatment', 'Care and Treatment');

  return (
    <div className={styles.tabContainer}>
      <Tabs>
        <TabList contained>
          <Tab>{t('hivsummary', 'HIV Summary')}</Tab>
          <Tab>{t('clinicalAssessment', 'Clinical Assessment')}</Tab>
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

export default CareAndTreatment;
