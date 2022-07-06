import React from "react";
import styles from "./cacx.scss";
import {
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib/src/index";
import { CaCx_SCREENING_LOG_ENCOUNTER_TYPE } from "../../../constants";
import { useTranslation } from "react-i18next";

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

const CaCxScreening: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t("cacxScreening", "Cacx Screening and Treatment");
  const displayText = t("cacxScreening", "Cacx Screening and Treatment");
  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={CaCx_SCREENING_LOG_ENCOUNTER_TYPE}
      form={{ package: "uganda_emr_cacx", name: "cacx_registration" }}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      dropdownText="Add"
    />
  );
};

export default CaCxScreening;
