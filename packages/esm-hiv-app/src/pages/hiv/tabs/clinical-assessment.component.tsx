import React from 'react';
import {getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import { useTranslation } from 'react-i18next';
import { CLINICAL_ASSESSMENT_ENCOUNTER_TYPE, ENROLLMENT_DATE, ENTRY_POINT } from '../../../constants';
import { ListEncounter, getObervationFromEncounter } from '../../../utils/encounter/list-encounter';

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
    <ListEncounter
      patientUuid={patientUuid}
      encounterUuid={CLINICAL_ASSESSMENT_ENCOUNTER_TYPE}
      form={{
        package: 'uganda_emr_hiv',
        name: 'hiv_clinical_assessment',
      }}
      columns={columns}
      description={headerTitle}
      headerTitle={headerTitle}
      displayText="Add"
    />
  );
};

export default ClinicalAssessment;
