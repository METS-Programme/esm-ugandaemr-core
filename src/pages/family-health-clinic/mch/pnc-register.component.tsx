import React from "react";
import { useTranslation } from "react-i18next";
import { POSTNATAL_ENCOUNTER_TYPE } from "../../../constants";
import {
  ListEncounter,
  getObervationFromEncounter,
} from "../../../utils/encounter/list-encounter";
const columns = [
  {
    key: "date",
    header: "Date Chart Opened",
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, "");
    },
  },
  {
    key: "testResult",
    header: "Entry Point",
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, "");
    },
  },
  {
    key: "testResult",
    header: "Date of NVP",
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, "");
    },
  },
  {
    key: "testResult",
    header: "Date of CTX",
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
    <ListEncounter
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
      launchOptions={{
        hideFormLauncher: false,
        moduleName: "",
        displayText: "Integrated Postnatal Register",
      }}
    />
  );
};

export default PncRegister;
