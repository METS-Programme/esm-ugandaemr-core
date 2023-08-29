import React, { useMemo } from 'react';
import {
  EmptyStateComingSoon,
  EncounterList,
  EncounterListColumn,
  clinicalVisitEncounterType,
  dateOfEncounterConcept,
  getObsFromEncounter,
  returnVisitDateConcept,
} from '@ohri/openmrs-esm-ohri-commons-lib/src/index';
import { useTranslation } from 'react-i18next';
import { PatientChartProps } from '../../types';
import { moduleName } from '../../constants';

const ClinicalAssessmentList: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('clincalAssessment');

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
              form: { name: 'OutPatient Clinical Form' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: t('viewDetails', 'View Details'),
              mode: 'view',
            },
            {
              form: { name: 'OutPatient Clinical Form' },
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
      formList={[{ name: 'OutPatient Clinical Form' }]}
      columns={columns}
      description="OutPatient Clinical Form"
      headerTitle={headerTitle}
      launchOptions={{
        displayText: 'Add',
        moduleName: moduleName,
      }}
    />
  );
};

export default ClinicalAssessmentList;
