import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  POSTNATAL_ENCOUNTER_TYPE,
  Referral_IN_OUT,
  Status_of_breast,
  Timing_For_PNC_Visit,
  moduleName,
} from '../../../../constants';

interface PncRegisterProps {
  patientUuid: string;
}

const PncRegister: React.FC<PncRegisterProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'timingForPNCVisit',
        header: t('timingForPNCVisit'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, Timing_For_PNC_Visit);
        },
      },
      {
        key: 'referral',
        header: t('referral'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, Referral_IN_OUT);
        },
      },
      {
        key: 'statusOfBreast',
        header: t('statusOfBreast'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, Status_of_breast);
        },
      },

      {
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => {
          const baseActions = [
            {
              form: { name: 'POC Postnatal Register' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'POC Postnatal Register' },
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

  const headerTitle = t('integratedPostnatalRegister', 'Integrated Postnatal Register');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={POSTNATAL_ENCOUNTER_TYPE}
      formList={[{ name: 'POC Postnatal Register' }]}
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
