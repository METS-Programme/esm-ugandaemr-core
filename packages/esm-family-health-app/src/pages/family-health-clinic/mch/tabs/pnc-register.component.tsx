import React, { useEffect, useMemo, useState } from 'react';
import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import { useTranslation } from 'react-i18next';
import { moduleName, POSTNATAL_ENCOUNTER_TYPE } from '../../../../constants';


interface PncRegisterProps {
  patientUuid: string;
}

const PncRegister: React.FC<PncRegisterProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'dateChartOpened',
        header: t('dateChartOpened', 'Date Chart Opened'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, "", true);
        },
      },
      {
        key: 'entryPoint',
        header: t('entryPoint', 'Entry Point'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, "");
        },
      },
      {
        key: 'dateNVP',
        header: t('dateNVP', 'Date of NVP'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, "");
        },
      },

      {
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => {
          const baseActions = [
            {
              form: { name: 'integrated_postnatal_register', package: 'uganda_emr_mch' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'integrated_postnatal_register', package: 'uganda_emr_mch' },
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

  const headerTitle = t('integratedPostnatalRegister', 'Integrated Postnatal Register');


  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={POSTNATAL_ENCOUNTER_TYPE}
      formList={[{ name: 'Integrated Postnatal Register' }]}
      columns={columnsLab}
      description={headerTitle}
      headerTitle={headerTitle}
      launchOptions={{
        displayText: 'Add',
        moduleName: moduleName,
      }}
    />  
  );
};

export default PncRegister;
