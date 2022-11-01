import React from "react";
import { useTranslation } from "react-i18next";
import { EID_FOLLOWUP_ENCOUNTER_TYPE } from "../../../../constants";
import {
  getObervationFromEncounter,
  ListEncounter,
} from "../../../../utils/encounter/list-encounter";

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

const EidRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t(
    "eidRegisterfollowupsection",
    "EID Register Follow up Section"
  );

  return (
    <ListEncounter
      patientUuid={patientUuid}
      encounterUuid={EID_FOLLOWUP_ENCOUNTER_TYPE}
      form={{ package: "uganda_emr_mch", name: "eid_followup" }}
      columns={columns}
      description={headerTitle}
      headerTitle={headerTitle}
      displayText="Add"
    />
  );
};

export default EidRegister;
