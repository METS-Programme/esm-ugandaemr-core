import React from "react";
import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib/src/index";
import { GenderMale16 } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import { MATERNITY_ENCOUNTER_TYPE } from "../../constants";

const columns: EncounterListColumn[] = [
  {
    key: "date",
    header: "Encounter Date",
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, "");
    },
  },
  {
    key: "entryPoint",
    header: "Entry Point",
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, "");
    },
  },
  {
    key: "actions",
    header: "Actions",
    getValue: () => {},
  },
];
const MaternityRegister: React.FC<{ patientUuid: string }> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const headerTitle = t(
    "integratedMaternityRegister",
    "Integrated Maternity Register"
  );
  const displayText = t(
    "integratedMaternityRegister",
    "Integrated Maternity Register"
  );

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={MATERNITY_ENCOUNTER_TYPE}
      form={{
        package: "uganda_emr_mch",
        name: "integrated_maternity_register",
      }}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      dropdownText="Add"
    />
  );
};

export default MaternityRegister;
