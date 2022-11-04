import React from "react";
import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib/src/index";
import { GenderMale16 } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import { OUTPATIENT_DEPARTMENT_ENCOUNTER_TYPE } from "../../constants";

const columns: EncounterListColumn[] = [
  {
    key: "admissionDate",
    header: "Admission Date",
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, "");
    },
  },
  {
    key: "deliveryType",
    header: "Delivery Type",
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
const OutpatientRegister: React.FC<{ patientUuid: string }> = ({
  patientUuid,
}) => {
  const { t } = useTranslation();

  const headerTitle = t("outpatientRegister", "Outpatient Register");
  const displayText = t("outpatientRegister", "Outpatient Register");

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={OUTPATIENT_DEPARTMENT_ENCOUNTER_TYPE}
      form={{
        package: "uganda_emr_opd",
        name: "outpatient_register",
      }}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      dropdownText="Add"
    />
  );
};

export default OutpatientRegister;
