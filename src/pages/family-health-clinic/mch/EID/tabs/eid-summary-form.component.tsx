import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib/src/index";
import React from "react";
import { useTranslation } from "react-i18next";
import { EID_SUMMARY_ENCOUNTER_TYPE } from "../../../../../constants";

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

const EIDSummaryForm: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t("eidRegister", "EID Register Summary Section");
  const displayText = t("eidRegister", "EID Register Summary Section");

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={EID_SUMMARY_ENCOUNTER_TYPE}
      form={{ package: "uganda_emr_mch", name: "eid_summary" }}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      dropdownText="Add"
      launchOptions={{
        hideFormLauncher: false,
        moduleName: "",
        displayText: "EID Register Summary Section",
      }}
    />
  );
};

export default EIDSummaryForm;
