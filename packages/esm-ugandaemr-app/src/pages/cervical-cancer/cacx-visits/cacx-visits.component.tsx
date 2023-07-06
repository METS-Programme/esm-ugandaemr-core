import { Tab, Tabs } from '@carbon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CaCxEligibilityLog from './cacx-eligibility-log.component';
import CaCxScreening from './cacx-screening-and-treatment.component';

interface OverviewListProps {
  patientUuid: string;
}

const CaCxVisits: React.FC<OverviewListProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  return (
    <Tabs>
      <TabList contained>
        <Tab className="tab-12rem">{t('cacxRegistration', 'Cacx Registration')}</Tab>
        <Tab>{t('cacxScreening', 'CaCx Screening')}</Tab>
        <Tab>{t('cacxTreatment', 'CaCx Treatment')}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <CaCxRegistrationList patientUuid={patientUuid} />
        </TabPanel>
        <TabPanel>
          <CacxScreeningList patientUuid={patientUuid} />
        </TabPanel>
        <TabPanel>
          <CacxTreatmentList patientUuid={patientUuid} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

