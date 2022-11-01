import React from "react";
import { useTranslation } from "react-i18next";
import {
  ADMISSION_DATE,
  DELIVERY_TYPE,
  MATERNITY_ENCOUNTER_TYPE,
} from "../../../../constants";
import {
  ListEncounter,
  getObervationFromEncounter,
} from "../../../../utils/encounter/list-encounter";

const columns = [
  {
    key: "admissionDate",
    header: "Admission Date",
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, ADMISSION_DATE);
    },
  },
  {
    key: "deliveryType",
    header: "Delivery Type",
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, DELIVERY_TYPE);
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

  return (
    <ListEncounter
      patientUuid={patientUuid}
      encounterUuid={MATERNITY_ENCOUNTER_TYPE}
      form={{
        package: "uganda_emr_mch",
        name: "integrated_maternity_register",
      }}
      columns={columns}
      description={headerTitle}
      headerTitle={headerTitle}
      displayText="Add"
    />
  );
};

export default MaternityRegister;
