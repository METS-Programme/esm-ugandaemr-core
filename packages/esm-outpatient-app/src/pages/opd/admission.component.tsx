import React, { useMemo } from 'react';
import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  clinicalVisitEncounterType,
  dateOfEncounterConcept,
  expressCareProgramStatusConcept,
  getObsFromEncounter,
  regimenConcept,
  returnVisitDateConcept,
  visitTypeConcept,
} from '@ohri/openmrs-esm-ohri-commons-lib/src/index';
import { useTranslation } from 'react-i18next';
import { PatientChartProps } from '../../types';
import { moduleName } from '../../constants';

const Admission: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('admission');

  const columns: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'clinicalVisitDate',
        header: t('visitDate', 'Visit Date'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, dateOfEncounterConcept, true);
        },
        link: {
          getUrl: (encounter) => encounter.url,
          handleNavigate: (encounter) => {
            encounter.launchFormActions?.viewEncounter();
          },
        },
      },
      {
        key: 'clinicalNextAppointmentDate',
        header: t('nextAppointmentDate', 'Next Appointment Date'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, returnVisitDateConcept, true);
        },
      },
      {
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => {
          const baseActions = [
            {
              form: { name: 'Admission form' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: t('viewDetails', 'View Details'),
              mode: 'view',
            },
            {
              form: { name: 'Admission form' },
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
      encounterType={clinicalVisitEncounterType}
      formList={[{ name: 'Admission form' }]}
      columns={columns}
      description="clinical visit encounters"
      headerTitle={headerTitle}
      launchOptions={{
        displayText: 'Add',
        moduleName: moduleName,
      }}
    />
  );
};

export default Admission;
