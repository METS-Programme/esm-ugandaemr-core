import React from 'react';
import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import { useTranslation } from 'react-i18next';
import { OUTPATIENT_DEPARTMENT_ENCOUNTER_TYPE } from '../../../constants';

const columns: EncounterListColumn[] = [
  {
    key: 'admissionDate',
    header: 'Admission Date',
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, '');
    },
  },
  {
    key: 'deliveryType',
    header: 'Delivery Type',
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, '');
    },
  },
  {
    key: 'actions',
    header: 'Actions',
    getValue: () => {},
  },
];
const OutpatientRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t('outpatientRegister', 'Outpatient Register');
  const displayText = t('outpatientRegister', 'Outpatient Register');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={OUTPATIENT_DEPARTMENT_ENCOUNTER_TYPE}
      form={{
        package: 'uganda_emr_opd',
        name: 'outpatient_register',
      }}
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

export default OutpatientRegister;
