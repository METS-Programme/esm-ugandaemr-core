import React, { useMemo, useState } from 'react';

import moment from 'moment';
import {
  EncounterList,
  EncounterListColumn,
  PatientChartProps,
  findObs,
  getObsFromEncounter,
} from '@ohri/openmrs-esm-ohri-commons-lib';
import { useTranslation } from 'react-i18next';
import { moduleName } from '../../../index';
import { PhsycosocialEncounterType } from '../../../constants';

const HtsOverviewList: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = 'Phsycosocial Support';

  const columns: EncounterListColumn[] = useMemo(
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
        key: 'hivTestResult',
        header: t('hivTestResult', 'HIV Test result'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, '--');
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
              form: { name: 'HTS Client Form' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: t('viewDetails', 'View Details'),
              mode: 'view',
            },
            {
              form: { name: 'HTS Client Form' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: t('editForm', 'Edit Form'),
              mode: 'edit',
            },
          ];
          return baseActions;
        },
      },
    ],
    [t],
  );

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={PhsycosocialEncounterType}
      formList={[{ name: 'HTS Client Form' }]}
      columns={columns}
      description={headerTitle}
      headerTitle={headerTitle}
      launchOptions={{
        displayText: 'Add',
        moduleName: moduleName,
      }}
    />
  );
};

export default HtsOverviewList;
