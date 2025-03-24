import { EncounterListTabsComponent } from "@ohri/openmrs-esm-ohri-commons-lib";
import { useConfig } from "@openmrs/esm-framework";
import React from "react";
import treatmentRegimenConfigSchema from "./treatment-regimen-config.json"

interface OverviewListProps {
  patientUuid: string;
}

const TreatmentRegimen: React.FC<OverviewListProps> = ({ patientUuid }) => {
  const config = useConfig();

  const tabFilter = (encounter, formName) => {
    return encounter?.form?.name === formName;
  };

  return (
    <EncounterListTabsComponent
      patientUuid={patientUuid}
      configSchema={treatmentRegimenConfigSchema}
      config={config}
      filter={tabFilter}
    />
  );
};

export default TreatmentRegimen;