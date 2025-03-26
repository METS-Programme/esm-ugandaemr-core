import { EncounterListTabsComponent } from '@ohri/openmrs-esm-ohri-commons-lib';
import { useConfig } from '@openmrs/esm-framework';
import React from 'react';

import dsTbConfigSchema from './eid-config.json';

interface OverviewListProps {
  patientUuid: string;
}

const EidSummary: React.FC<OverviewListProps> = ({ patientUuid }) => {
  const config = useConfig();

  const tabFilter = (encounter, formName) => {
    return encounter?.form?.name === formName;
  };

  return (
    <EncounterListTabsComponent
      patientUuid={patientUuid}
      configSchema={dsTbConfigSchema}
      config={config}
      filter={tabFilter}
    />
  );
};

export default EidSummary;
