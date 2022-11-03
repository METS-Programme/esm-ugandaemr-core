import React from 'react';
import { CaCx_TREATMENT_ENCOUNTER_TYPE } from '../../../constants';
import { useTranslation } from 'react-i18next';
import { getObervationFromEncounter, ListEncounter } from '../../../utils/encounter/list-encounter';

const columns = [
  {
    key: 'date',
    header: 'Date',
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, '');
    },
  },
  {
    key: 'testResult',
    header: 'Test Result',
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, '');
    },
  },
  {
    key: 'actions',
    header: 'Actions',
    getValue: () => {},
  },
];

const CaCxEligibilityLog: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('CaCx Eligibility Log', 'CaCx Eligibility Log');

  return (
    <ListEncounter
      patientUuid={patientUuid}
      encounterUuid={CaCx_TREATMENT_ENCOUNTER_TYPE}
      form={{ package: 'uganda_emr_cacx', name: 'cacx_screening_log' }}
      columns={columns}
      description={headerTitle}
      headerTitle={headerTitle}
      displayText="Add"
    />
  );
};

export default CaCxEligibilityLog;
