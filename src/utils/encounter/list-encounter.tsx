import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from "@ohri/openmrs-esm-ohri-commons-lib/src/index";
import { MATERNITY_ENCOUNTER_TYPE } from "../../constants";

export const ListEncounter = ({
  patientUuid,
  encounterUuid,
  form,
  columns,
  description,
  headerTitle,
  dropdownText,
}) => {
  const tablecolumns: EncounterListColumn[] = columns;

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={encounterUuid}
      form={form}
      columns={tablecolumns}
      description={description}
      headerTitle={headerTitle}
      dropdownText={dropdownText}
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
