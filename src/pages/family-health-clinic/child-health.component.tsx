import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib/src/index";
import React from "react";
import { useTranslation } from "react-i18next";
import { CHILD_REGISTER_ENCOUNTER_TYPE } from "../../constants";
const columns: EncounterListColumn[] = [
  {
    key: "date",
    header: "Date Chart Opened",
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, "");
    },
  },
  {
    key: "testResult",
    header: "Entry Point",
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, "");
    },
  },
  {
    key: "testResult",
    header: "Date of NVP",
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, "");
    },
  },
  {
    key: "testResult",
    header: "Date of CTX",
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

const ChildHealthRegister: React.FC<{ patientUuid: string }> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const headerTitle = t("childHealthRegister", "Child Health Register");
  const displayText = t("childHealthRegister", "Child Health Register");

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={CHILD_REGISTER_ENCOUNTER_TYPE}
      form={{
        package: "uganda_emr_family_health",
        name: "child_health_register",
      }}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      dropdownText="Add"
      launchOptions={{
        hideFormLauncher: false,
        moduleName: "",
        displayText: "Child Health Register",
      }}
    />
  );
};

export default ChildHealthRegister;
