import React, { useEffect, useMemo, useState } from 'react';
import {moduleName, CaCx_TREATMENT_ENCOUNTER_TYPE } from '../../../constants';
import { useTranslation } from 'react-i18next'; 
import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';

interface CaCxEligibilityLogProps {
  patientUuid: string;
}


const CaCxEligibilityLog: React.FC<CaCxEligibilityLogProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  
  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'date',
        header: t('date', 'Date'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, "");
        },
      },
      {
        key: 'testResult',
        header: t('testResult', 'Test Result'),
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
              form: { name: 'cacx_screening_log', package: 'uganda_emr_cacx' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'cacx_screening_log', package: 'uganda_emr_cacx' },
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

  const headerTitle = t('CaCx Eligibility Log', 'CaCx Eligibility Log');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={CaCx_TREATMENT_ENCOUNTER_TYPE}
      formList={[{name: 'cacx_screening_log' }]}
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

export default CaCxEligibilityLog;
