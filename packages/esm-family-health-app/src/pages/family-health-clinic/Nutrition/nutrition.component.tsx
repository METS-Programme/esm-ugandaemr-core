import React, { useMemo } from 'react';
import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  getObsFromEncounter,
} from '@ohri/openmrs-esm-ohri-commons-lib/src/index';
import { useTranslation } from 'react-i18next';
import { PatientChartProps } from '../../../types';
import { CHILD_REGISTER_ENCOUNTER_TYPE, moduleName } from '../../../constants';

const Nutrition: React.FC<PatientChartProps> = ({ patientUuid }) => {
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
        key: 'deliveryType',
        header: t('deliveryType', 'Delivery Type'),
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
              form: { name: 'Nutrition Clinical Form', package: 'uganda_emr_mch' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'Nutrition Clinical Form', package: 'uganda_emr_mch' },
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

  const headerTitle = t('nutrition');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={CHILD_REGISTER_ENCOUNTER_TYPE}
      formList={[{ name: 'Nutrition Clinical Form' }]}
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

export default Nutrition;
