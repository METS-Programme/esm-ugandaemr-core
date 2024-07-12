import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import styles from './clinical-patient-summary-tabs.scss';
import SubjectiveFindingsComponent from './subjective-findings.component';
import ObjectiveFindingsComponent from './objective-findings.component';
import TreatmentPlanComponent from './treatment-plan.component';
import AssessmentComponent from './assessment.component';

export const ClinicalPatientSummaryTabs = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div className={styles.tabcontainer}>
      <Tabs selectedIndex={selectedTab} onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}>
        <TabList>
          <Tab>{t('subjectiveFindings', 'Subjective Findings')}</Tab>
          <Tab>{t('objectiveFindings', 'Objective Findings')}</Tab>
          <Tab>{t('assessment', 'Assessment')}</Tab>
          <Tab>{t('treatmentPlan', 'Treatment Plan')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SubjectiveFindingsComponent />
          </TabPanel>
          <TabPanel>
            <ObjectiveFindingsComponent />
          </TabPanel>
          <TabPanel>
            <AssessmentComponent />
          </TabPanel>
          <TabPanel>
            <TreatmentPlanComponent />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default ClinicalPatientSummaryTabs;
