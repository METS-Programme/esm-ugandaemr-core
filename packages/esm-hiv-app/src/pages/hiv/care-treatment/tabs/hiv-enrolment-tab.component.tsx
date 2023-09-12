import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EncounterListColumn, findObs, getObsFromEncounter, EncounterList } from '@ohri/openmrs-esm-ohri-commons-lib';
import { careAndTreatmentEncounterType, TransferInDateConceptUUID, InSchoolConceptUUID } from '../../../../constants';
import { moduleName } from '../../../../index';

interface HIVEnrolmentTabListProps {
  patientUuid: string;
}

const HIVEnrolmentTabList: React.FC<HIVEnrolmentTabListProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const columns: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'transferInDate',
        header: t('transferInDate', 'Transfer In Date '),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, TransferInDateConceptUUID, true);
        },
      },
      {
        key: 'inSchool',
        header: t('inSchool', 'In School (5 -19 years)'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, InSchoolConceptUUID);
        },
      },
      {
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => [
          {
            form: { name: 'ART Enrollment Form' },
            encounterUuid: encounter.uuid,
            intent: '*',
            label: t('viewDetails', 'View Details'),
            mode: 'view',
          },
          {
            form: { name: 'ART Enrollment Form' },
            encounterUuid: encounter.uuid,
            intent: '*',
            label: t('editForm', 'Edit Form'),
            mode: 'edit',
          },
        ],
      },
    ],
    [t],
  );

  const headerTitle = t('hivEnrolment', 'HIV Enrolment');
  const displayText = t('hivEnrolment', 'HIV Enrolment');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={careAndTreatmentEncounterType}
      formList={[{ name: 'ART Enrollment Form' }]}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      launchOptions={{
        displayText: t('add', 'Add'),
        moduleName: moduleName,
      }}
    />
  );
};

export default HIVEnrolmentTabList;
