import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EID_SUMMARY_ENCOUNTER_TYPE, moduleName } from '../../../../constants';

interface EIDSummaryFormProps {
  patientUuid: string;
}

const EIDSummaryForm: React.FC<EIDSummaryFormProps> = ({ patientUuid }) => {
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
              form: { name: 'eid_summary', package: 'uganda_emr_mch' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'eid_summary', package: 'uganda_emr_mch' },
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

  const headerTitle = t('eidRegister', 'EID Register Summary Section');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={EID_SUMMARY_ENCOUNTER_TYPE}
      formList={[{ name: 'eid_summary' }]}
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

export default EIDSummaryForm;
