import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EncounterListColumn,
  getObsFromEncounter,
  EncounterList,
} from '@ugandaemr/esm-ugandaemr-commons-lib/src/index';
import {
  clinicalVisitEncounterType,
  dateOfEncounterConcept,
  returnVisitDateConcept,
  tbScreeningOutcome,
  visitTypeConcept,
} from '../../../../constants';
import { moduleName } from '../../../../index';

interface ClinicalVisitListProps {
  patientUuid: string;
}

const ClinicalVisitList: React.FC<ClinicalVisitListProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t('clinicalAssessment');

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
        key: 'clinicalVisitType',
        header: t('visitType', 'Visit Type'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, visitTypeConcept);
        },
      },
      {
        key: 'clinicalScreeningOutcome',
        header: t('tbScreeningOutcome', 'TB Screening Outcome'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, tbScreeningOutcome);
        },
      },
      {
        key: 'clinicalNextAppointmentDate',
        header: t('nextAppointmentDate', 'Next Appointment Date'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, returnVisitDateConcept);
        },
      },
      {
        key: 'clinicalAppointmentReason',
        header: t('appointmentReason', 'Appointment Reason'),
        getValue: (encounter) => {
          return '--';
        },
      },
      {
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => {
          const baseActions = [
            {
              form: { name: 'POC Clinical Visit Form' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: t('viewDetails'),
              mode: 'view',
            },
            {
              form: { name: 'POC Clinical Visit Form' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: t('editDetails'),
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
      formList={[{ name: 'POC Clinical Visit Form' }]}
      columns={columns}
      description="clinical visit encounters"
      headerTitle={headerTitle}
      launchOptions={{
        moduleName: moduleName,
      }}
    />
  );
};

export default ClinicalVisitList;
