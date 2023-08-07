import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { moduleName, EID_FOLLOWUP_ENCOUNTER_TYPE } from '../../../../constants'; 
import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';

interface EidRegisterProps {
  patientUuid: string;
}

const EidRegister: React.FC<EidRegisterProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'dateChartOpened',
        header: t('dateChartOpened', 'Date Chart Opened'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, "");
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
              form: { name: 'eid_followup', package: 'uganda_emr_mch' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'eid_followup', package: 'uganda_emr_mch' },
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

  const headerTitle = t('eidRegisterfollowupsection', 'EID Register Follow up Section');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={EID_FOLLOWUP_ENCOUNTER_TYPE}
      formList={[{name: 'eid_followup'}]}
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

export default EidRegister;
