import React from "react";
import styles from "./cacx.scss";
import { CaCx_SCREENING_LOG_ENCOUNTER_TYPE } from "../../../constants";
import { useTranslation } from "react-i18next";
import {
  getObervationFromEncounter,
  ListEncounter,
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

const CaCxScreening: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t("cacxScreening", "Cacx Screening and Treatment");
  const displayText = t("cacxScreening", "Cacx Screening and Treatment");
  return (
    <ListEncounter
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
