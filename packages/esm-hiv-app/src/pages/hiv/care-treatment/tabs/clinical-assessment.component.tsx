import React from 'react';
import {EncounterList, getObsFromEncounter} from '@ohri/openmrs-esm-ohri-commons-lib';
import { useTranslation } from 'react-i18next';
import { CLINICAL_ASSESSMENT_ENCOUNTER_TYPE, ENROLLMENT_DATE, ENTRY_POINT } from '../../../../constants';
import {OUTPATIENT_DEPARTMENT_ENCOUNTER_TYPE} from "@ugandaemr/esm-outpatient-app/src/constants";

const columns = [
  {
    key: 'enrollmentDate',
    header: 'Enrollment Date',
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, ENROLLMENT_DATE);
    },
  },
  {
    key: 'entryPoint',
    header: 'Entry Point',
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, ENTRY_POINT);
    },
  },
  {
    key: 'actions',
    header: 'Actions',
    getValue: () => {},
  },
];
const ClinicalAssessment: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t('clinicalAssessment', 'Clinical Assessment');
  const displayText = t('clinicalAssessment', 'Clinical Assessment');

  return (
  <EncounterList
    patientUuid={patientUuid}
    encounterType={CLINICAL_ASSESSMENT_ENCOUNTER_TYPE}
    formList={[{ name: 'hiv_clinical_assessment' }]}
    columns={columns}
    description={displayText}
    headerTitle={headerTitle}
    launchOptions={{
      hideFormLauncher: false,
      moduleName: '',
      displayText: 'Add',
    }}
  />
  );
};

export default ClinicalAssessment;
