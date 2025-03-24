import React from 'react';
import { useConfig } from '@openmrs/esm-framework';
import { EncounterListTabsComponent } from '@ohri/openmrs-esm-ohri-commons-lib';
import patientTransfersConfigSchema from './patient-transfers-config.json';

interface OverviewListProps {
  patientUuid: string;
}

const PatientTransfersSummary: React.FC<OverviewListProps> = ({ patientUuid }) => {
  const config = useConfig();

  const tabFilter = (encounter, formName) => {
    return encounter?.form?.name === formName;
  };

  return (
    <EncounterListTabsComponent
      patientUuid={patientUuid}
      configSchema={patientTransfersConfigSchema}
      config={config}
      filter={tabFilter}
    />
  );
};

export default PatientTransfersSummary;
