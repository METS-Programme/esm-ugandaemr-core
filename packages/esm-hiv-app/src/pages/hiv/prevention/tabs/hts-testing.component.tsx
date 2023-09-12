import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CLINICAL_ASSESSMENT_ENCOUNTER_TYPE, moduleName } from '../../../../constants';

interface HTSTestingProps {
  patientUuid: string;
}

const HTSTesting: React.FC<HTSTestingProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'admissionDate',
        header: t('admissionDate', 'Admission Date'),
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
              form: { name: 'integrated_maternity_register', package: 'uganda_emr_hiv' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'integrated_maternity_register', package: 'uganda_emr_hiv' },
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

  const headerTitle = t('integratedMaternityRegister', 'Integrated Maternity Register');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={CLINICAL_ASSESSMENT_ENCOUNTER_TYPE}
      formList={[{ name: 'integrated_maternity_register' }]}
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

export default HTSTesting;
