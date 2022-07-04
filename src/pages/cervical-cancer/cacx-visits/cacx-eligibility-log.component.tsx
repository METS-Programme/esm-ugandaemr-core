import React from "react";
import {
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib/src/index";
import { CaCx_TREATMENT_ENCOUNTER_TYPE } from "../../../constants";
import { useTranslation } from "react-i18next";

const columns: EncounterListColumn[] = [
  {
    key: "date",
    header: "Date",
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, "");
    },
  },
  {
    key: "testResult",
    header: "Test Result",
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

const CaCxEligibilityLog: React.FC<{ patientUuid: string }> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const headerTitle = t("CaCx Eligibility Log", "CaCx Eligibility Log");
  const displayText = t("CaCx Eligibility Log", "CaCx Eligibility Log");

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={CaCx_TREATMENT_ENCOUNTER_TYPE}
      form={{ package: "uganda_emr_cacx", name: "cacx_screening_log" }}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      dropdownText="Add"
    />
  );
};

export default CaCxEligibilityLog;
