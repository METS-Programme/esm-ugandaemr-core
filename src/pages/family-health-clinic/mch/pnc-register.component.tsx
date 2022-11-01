import React, { useMemo } from "react";
import {
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib/src/index";
import { useTranslation } from "react-i18next";
import {
  covidEncounterDateTime_UUID,
  covidReasonsForTestingConcep_UUID,
  covid_Assessment_EncounterUUID,
  moduleName,
  POSTNATAL_ENCOUNTER_TYPE,
} from "../../../constants";

// const columns = [
//   {
//     key: "date",
//     header: "Date Chart Opened",
//     getValue: (encounter) => {
//       return getObervationFromEncounter(encounter, "");
//     },
//   },
//   {
//     key: "testResult",
//     header: "Entry Point",
//     getValue: (encounter) => {
//       return getObervationFromEncounter(encounter, "");
//     },
//   },
//   {
//     key: "testResult",
//     header: "Date of NVP",
//     getValue: (encounter) => {
//       return getObervationFromEncounter(encounter, "");
//     },
//   },
//   {
//     key: "testResult",
//     header: "Date of CTX",
//     getValue: (encounter) => {
//       return getObervationFromEncounter(encounter, "");
//     },
//   },
//   {
//     key: "actions",
//     header: "Actions",
//     getValue: () => {},
//   },
// ];

const PncRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t(
    "integratedPostnatalRegister",
    "Integrated Postnatal Register"
  );

  const columns: EncounterListColumn[] = useMemo(
    () => [
      {
        key: "encounterDate",
        header: t("encounterDate", "Date of Assessment"),
        getValue: (encounter) => "encounterDate",
      },
      {
        key: "reasonsForTesting",
        header: t("reasonsForTesting", "Reason for testing"),
        getValue: (encounter) => "reasonsForTesting",
      },
    ],
    []
  );

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={covid_Assessment_EncounterUUID}
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
