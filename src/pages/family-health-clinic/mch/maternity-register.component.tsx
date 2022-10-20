import React from "react";
import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib/src/index";
import { useTranslation } from "react-i18next";
import {
  ADMISSION_DATE,
  DELIVERY_TYPE,
  MATERNITY_ENCOUNTER_TYPE,
} from "../../../constants";

const columns: EncounterListColumn[] = [
  {
    key: "admissionDate",
    header: "Admission Date",
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, ADMISSION_DATE);
    },
  },
  {
    key: "deliveryType",
    header: "Delivery Type",
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, DELIVERY_TYPE);
    },
  },
  {
    key: "actions",
    header: "Actions",
    getValue: () => {},
  },
];
const MaternityRegister: React.FC<{ patientUuid: string }> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const headerTitle = t(
    "integratedMaternityRegister",
    "Integrated Maternity Register"
  );
  const displayText = t(
    "integratedMaternityRegister",
    "Integrated Maternity Register"
  );

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={MATERNITY_ENCOUNTER_TYPE}
      form={{
        package: "uganda_emr_mch",
        name: "integrated_maternity_register",
      }}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      dropdownText="Add"
      launchOptions={{
        hideFormLauncher: false,
        moduleName: "",
        displayText: "Integrated Maternity Register",
      }}
    />
  );
};

export default MaternityRegister;
