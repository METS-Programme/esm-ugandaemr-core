import React from "react";
import styles from "./cacx.scss";
import {
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "openmrs-esm-ohri-commons-lib/src/index";
import { CaCx_SCREENING_LOG_ENCOUNTER_TYPE } from "../../../constants";
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

const CaCxScreening: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t("cacxScreening", "Cacx Screening and Treatment");
  const displayText = t("cacxScreening", "Cacx Screening and Treatment");
  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={CaCx_SCREENING_LOG_ENCOUNTER_TYPE}
      form={{ package: "uganda-emr-cacx", name: "cacx_screening_log" }}
      columns={columns}
      headerTitle={headerTitle}
      description={displayText}
      dropdownText="Add"
    />
  );
};

export default CaCxScreening;
