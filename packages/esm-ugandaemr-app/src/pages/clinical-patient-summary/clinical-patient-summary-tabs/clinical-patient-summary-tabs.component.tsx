import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@carbon/react';
import styles from './clinical-patient-summary-tabs.scss';

interface clinicalPatientSummaryTabs {
  patientUuid: string;
}

export const ClinicalPatientSummaryTabs: React.FC<clinicalPatientSummaryTabs> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div className={styles.container}>
      <Tabs selectedIndex={selectedTab} onChange={({ selectedIndex }) => setSelectedTab(selectedIndex)}>
        <TabList>
          <Tab>{t('subjectiveFindings', 'Subjective Findings')}</Tab>
          <Tab>{t('objectiveFindings', 'Objective Findings')}</Tab>
          <Tab>{t('assessment', 'Assessment')}</Tab>
          <Tab>{t('treatmentPlan', 'Treatment Plan')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default ClinicalPatientSummaryTabs;
