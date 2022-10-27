import React from "react";
import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib/src/index";
import { useTranslation } from "react-i18next";
import { ANTENATAL_ENCOUNTER_TYPE } from "../../../constants";
import ListEncounter, {
  getObervationFromEncounter,
} from "../../../utils/encounter/list-encounter";

const columns = [
  {
    key: "date",
    header: "Encounter Date",
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, "");
    },
  },
  {
    key: "entryPoint",
    header: "Entry Point",
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, "");
    },
  },
  {
    key: "actions",
    header: "Actions",
    getValue: () => {},
  },
];
const ANCRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t(
    "integratedAntenatalRegister",
    "Integrated Antenatal Register"
  );
  const displayText = t(
    "integratedAntenatalRegister",
    "Integrated Antenatal Register"
  );

  return (
    <ListEncounter
      patientUuid={patientUuid}
      encounterUuid={ANTENATAL_ENCOUNTER_TYPE}
      form={{
        package: "uganda_emr_mch",
        name: "integrated_antenatal_register",
      }}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      dropdownText="Add"
      launchOptions={{
        hideFormLauncher: false,
        moduleName: "",
        displayText: "Integrated Antenatal Register",
      }}
    />
  );
};

export default ANCRegister;
