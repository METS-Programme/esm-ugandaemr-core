import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ANTENATAL_ENCOUNTER_TYPE, POSTNATAL_ENCOUNTER_TYPE, moduleName } from '../../../../constants';

interface ANCRegisterProps {
  patientUuid: string;
}

const ANCRegister: React.FC<ANCRegisterProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'encounterDate',
        header: t('encounterDate', 'Encounter Date'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, '');
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
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => {
          const baseActions = [
            {
              form: { name: 'POC IntegratedAntenatalRegister.' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'POC IntegratedAntenatalRegister.' },
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
    [t],
  );

  const headerTitle = t('integratedAntenatalRegister', 'Integrated Antenatal Register');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={ANTENATAL_ENCOUNTER_TYPE}
      formList={[{ name: 'POC IntegratedAntenatalRegister.' }]}
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

export default ANCRegister;
