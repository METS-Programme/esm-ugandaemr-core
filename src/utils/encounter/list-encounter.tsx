import React from "react";
import {
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib";
import { moduleName } from "../../index";

export const ListEncounter = ({
  patientUuid,
  encounterUuid,
  form,
  columns,
  description,
  headerTitle,
  displayText,
}) => {
  const tablecolumns: EncounterListColumn[] = columns;

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={encounterUuid}
      form={form}
      columns={tablecolumns}
      headerTitle={headerTitle}
      description={description}
      launchOptions={{
        displayText: displayText,
        moduleName: moduleName,
      }}
    />
  );
};

export function getObervationFromEncounter(encounter, obsConcept) {
  return getObsFromEncounter(encounter, obsConcept).value;
}
