import { EncounterListTabsComponent } from "@ohri/openmrs-esm-ohri-commons-lib";
import { useConfig } from "@openmrs/esm-framework";
import React from "react";
import drTbConfigSchema from "./dr-tb-config.json";

interface OverviewListProps {
  patientUuid: string;
}

const DRTBSummary: React.FC<OverviewListProps> = ({ patientUuid }) => {
  const config = useConfig();

  const tabFilter = (encounter, formName) => {
    return encounter?.form?.name === formName;
  };

  return (
    <EncounterListTabsComponent
      patientUuid={patientUuid}
      configSchema={drTbConfigSchema}
      config={config}
      filter={tabFilter}
    />
  );
};

export default DRTBSummary;