import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import {
  CACX_Treatment_Screening_ENCOUNTER_TYPE,
  Cervical_cancer_histology_results,
  moduleName,
} from '../../../constants';
import moment from 'moment';

interface EIDSummaryFormProps {
  patientUuid: string;
}

const EIDSummaryForm: React.FC<EIDSummaryFormProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'date',
        header: t('hivTestDate', 'Date of HIV Test'),
        getValue: (encounter) => {
          return moment(encounter.encounterDatetime).format('DD-MMM-YYYY');
        },
      },
      {
        key: 'location',
        header: t('location', 'Location'),
        getValue: (encounter) => {
          return encounter.location.name;
        },
      },
      {
        key: 'cacxHistology',
        header: t('cacxHistology', 'Cervical cancer histology results'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, Cervical_cancer_histology_results);
        },
      },
      {
        key: 'provider',
        header: t('htsProvider', 'HTS Provider'),
        getValue: (encounter) => {
          return encounter.encounterProviders.map((p) => p.provider.name).join(' | ');
        },
      },
      {
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => {
          const baseActions = [
            {
              form: { name: 'Screening and Cancer Treatment Form' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'Screening and Cancer Treatment Form' },
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

  const headerTitle = t('cacx_screening_treatment', 'Cervical Cancer Screening And Treatment');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={CACX_Treatment_Screening_ENCOUNTER_TYPE}
      formList={[{ name: 'Screening and Cancer Treatment Form' }]}
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
