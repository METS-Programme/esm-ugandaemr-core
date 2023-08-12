import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CaCx_SCREENING_LOG_ENCOUNTER_TYPE, moduleName } from '../../../constants';

interface CaCxScreeningProps {
  patientUuid: string;
}

const CaCxScreening: React.FC<CaCxScreeningProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'date',
        header: t('date', 'Date'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, '');
        },
      },
      {
        key: 'testResult',
        header: t('testResult', 'Test Result'),
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
              form: { name: 'cacx_registration', package: 'uganda_emr_cacx' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'cacx_registration', package: 'uganda_emr_cacx' },
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

  const headerTitle = t('cacxScreening', 'Cacx Screening and Treatment');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={CaCx_SCREENING_LOG_ENCOUNTER_TYPE}
      formList={[{ name: 'cacx_registration' }]}
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

export default CaCxScreening;
