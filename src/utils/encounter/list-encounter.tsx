import React from "react";
import PropTypes from "prop-types";
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

ListEncounter.protoTypes = {
  patientUuid: PropTypes.object,
  encounterUuid: PropTypes.object,
  form: PropTypes.object,
  columns: PropTypes.array,
  description: PropTypes.object,
  headerTitle: PropTypes.object,
  dropdownText: PropTypes.string,
};

export function getObervationFromEncounter(encounter, obsConcept) {
  return getObsFromEncounter(encounter, obsConcept).value;
}

export default ListEncounter;
