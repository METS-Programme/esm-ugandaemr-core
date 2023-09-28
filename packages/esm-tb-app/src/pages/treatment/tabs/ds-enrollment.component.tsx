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
import { DS_TB_Enrollment_ENCOUNTER_TYPE, moduleName } from '../../../constants';

const DSTBEnrollmentList: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = 'DS Enrollment';

  const columns: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'date',
        header: t('encounterDate', 'Encounter Date'),
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
        key: 'diseaseClasific',
        header: t('diseaseClasific', 'Disease Classification and Patient Type'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, '--');
        },
      },
      {
        key: 'provider',
        header: t('provider', 'Provider'),
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
              form: { name: 'DS TB Enrollment Form' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: t('viewDetails', 'View Details'),
              mode: 'view',
            },
            {
              form: { name: 'DS TB Enrollment Form' },
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
      encounterType={DS_TB_Enrollment_ENCOUNTER_TYPE}
      formList={[{ name: 'DS TB Enrollment Form' }]}
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

export default DSTBEnrollmentList;
