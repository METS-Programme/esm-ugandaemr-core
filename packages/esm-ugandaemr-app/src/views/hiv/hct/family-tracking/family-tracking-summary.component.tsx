import React from 'react';
import { useConfig } from '@openmrs/esm-framework';
import { EncounterListTabsComponent } from '@ohri/openmrs-esm-ohri-commons-lib';
import familyTrackingConfigSchema from './family-tracking-config.json';

interface OverviewListProps {
  patientUuid: string;
}

const FamilyTrackingSummary: React.FC<OverviewListProps> = ({ patientUuid }) => {
  const config = useConfig();

  const tabFilter = (encounter, formName) => {
    return encounter?.form?.name === formName;
  };

  return (
    <EncounterListTabsComponent
      patientUuid={patientUuid}
      configSchema={familyTrackingConfigSchema}
      config={config}
      filter={tabFilter}
    />
  );
};

export default FamilyTrackingSummary;