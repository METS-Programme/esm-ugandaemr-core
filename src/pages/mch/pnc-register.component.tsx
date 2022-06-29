import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "openmrs-esm-ohri-commons-lib/src/index";
import React from "react";
import { useTranslation } from "react-i18next";
import { POSTNATAL_ENCOUNTER_TYPE } from "../../constants";
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

const PncRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t(
    "integratedPostnatalRegister",
    "Integrated Postnatal Register"
  );
  const displayText = t(
    "integratedPostnatalRegister",
    "Integrated Postnatal Register"
  );

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={POSTNATAL_ENCOUNTER_TYPE}
      form={{
        package: "uganda_emr_mch",
        name: "integrated_postnatal_register",
      }}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      dropdownText="Add"
    />
  );
};

export default PncRegister;
