import { Tab, Tabs } from '@carbon/react';
import React from 'react';
import CaCxEligibilityLog from './cacx-eligibility-log.component';
import CaCxScreening from './cacx-screening-and-treatment.component';

const CaCxVisits: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  return (
    <Tabs type="container">
      <Tab label="Cacx Eligibility Log" style={{ padding: 0 }}>
        <CaCxEligibilityLog patientUuid={patientUuid} />
      </Tab>
      <Tab label="CaCx Screening and Treatment" style={{ padding: 0 }}>
        <CaCxScreening patientUuid={patientUuid} />
      </Tab>
    </Tabs>
  );
};

export default CaCxVisits;
