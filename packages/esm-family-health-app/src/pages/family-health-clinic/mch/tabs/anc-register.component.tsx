import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EncounterListColumn } from '@ohri/openmrs-esm-ohri-commons-lib';
import { ANTENATAL_ENCOUNTER_TYPE } from '../../../../constants';
import { getObervationFromEncounter, ListEncounter } from '../../../../utils/encounter/list-encounter';

const ANCRegister: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t('integratedAntenatalRegister', 'Integrated Antenatal Register');

  const columns: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'date',
        header: 'Encounter Date',
        getValue: (encounter) => {
          return getObervationFromEncounter(encounter, '');
        },
      },
      {
        key: 'entryPoint',
        header: 'Entry Point',
        getValue: (encounter) => {
          return getObervationFromEncounter(encounter, '');
        },
      },
      {
        key: 'actions',
        header: 'Actions',
        getValue: () => {},
      },
    ],
    [],
  );

  return (
    <ListEncounter
      patientUuid={patientUuid}
      encounterUuid={ANTENATAL_ENCOUNTER_TYPE}
      form={{
        package: 'uganda_emr_mch',
        name: 'integrated_antenatal_register',
      }}
      columns={columns}
      description={headerTitle}
      headerTitle={headerTitle}
      displayText="Add"
    />
  );
};

export default ANCRegister;
