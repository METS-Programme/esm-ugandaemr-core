import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OUTPATIENT_DEPARTMENT_ENCOUNTER_TYPE } from '../../../constants';

interface OutpatientRegisterProps {
  patientUuid: string;
}

const OutpatientRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'dateChartOpened',
        header: t('dateChartOpened', 'Date Chart Opened'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, '', true);
        },
      },
      {
        key: 'entryPoint',
        header: t('entryPoint', 'Entry Point'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, '');
        },
      },
      {
        key: 'dateNVP',
        header: t('dateNVP', 'Date of NVP'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, '');
        },
      },

      {
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => {
          const baseActions = [
            {
              form: { name: 'outpatient_register', package: 'uganda_emr_opd' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'outpatient_register', package: 'uganda_emr_opd' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'Edit Form',
              mode: 'edit',
            },
          ];
          return baseActions;
        },
      },
    ],
    [],
  );

  const headerTitle = t('outpatientRegister', 'Outpatient Register');
  const displayText = t('outpatientRegister', 'Outpatient Register');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={OUTPATIENT_DEPARTMENT_ENCOUNTER_TYPE}
      formList={[{ name: 'outpatient_register' }]}
      columns={columnsLab}
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
