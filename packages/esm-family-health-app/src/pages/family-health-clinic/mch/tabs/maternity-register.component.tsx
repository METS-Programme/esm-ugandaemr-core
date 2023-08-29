import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ADMISSION_DATE, DELIVERY_TYPE, MATERNITY_ENCOUNTER_TYPE, moduleName } from '../../../../constants';

interface MaternityRegisterProps {
  patientUuid: string;
}

const MaternityRegister: React.FC<MaternityRegisterProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'admissionDate',
        header: t('admissionDate', 'Admission Date'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, ADMISSION_DATE);
        },
      },
      {
        key: 'deliveryType',
        header: t('deliveryType', 'Delivery Type'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, DELIVERY_TYPE);
        },
      },

      {
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => {
          const baseActions = [
            {
              form: { name: 'POC IntegratedMaternityRegister.', package: 'uganda_emr_mch' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'POC IntegratedMaternityRegister.', package: 'uganda_emr_mch' },
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
      encounterType={MATERNITY_ENCOUNTER_TYPE}
      formList={[{ name: 'POC IntegratedMaternityRegister.' }]}
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

export default MaternityRegister;
