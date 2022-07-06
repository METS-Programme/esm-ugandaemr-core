import React from "react";
import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib/src/index";
import { GenderMale16 } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import { ANTENATAL_ENCOUNTER_TYPE } from "../../constants";

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
const ANCRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t(
    "integratedAntenatalRegister",
    "Integrated Antenatal Register"
  );
  const displayText = t(
    "integratedAntenatalRegister",
    "Integrated Antenatal Register"
  );

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={ANTENATAL_ENCOUNTER_TYPE}
      form={{
        package: "uganda_emr_mch",
        name: "integrated_antenatal_register",
      }}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      dropdownText="Add"
    />
  );
};

export default ANCRegister;
