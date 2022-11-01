import React, { useMemo } from "react";
import {
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib";
import { useTranslation } from "react-i18next";
import { moduleName, POSTNATAL_ENCOUNTER_TYPE } from "../../../../constants";

const PncRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t(
    "integratedPostnatalRegister",
    "Integrated Postnatal Register"
  );

  const columns: EncounterListColumn[] = useMemo(
    () => [
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
    ],
    []
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
      headerTitle={headerTitle}
      description={headerTitle}
      launchOptions={{
        displayText: "Add",
        moduleName: moduleName,
      }}
    />
  );
};

export default PncRegister;
