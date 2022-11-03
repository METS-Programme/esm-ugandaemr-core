import React from 'react';
import { useTranslation } from 'react-i18next';
import { EID_SUMMARY_ENCOUNTER_TYPE } from '../../../../constants';
import { getObervationFromEncounter, ListEncounter } from '../../../../utils/encounter/list-encounter';

const columns = [
  {
    key: 'date',
    header: 'Date Chart Opened',
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, '');
    },
  },
  {
    key: 'testResult',
    header: 'Entry Point',
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, '');
    },
  },
  {
    key: 'testResult',
    header: 'Date of NVP',
    getValue: (encounter) => {
      return getObervationFromEncounter(encounter, '');
    },
  },
  {
    key: 'testResult',
    header: 'Date of CTX',
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

const EIDSummaryForm: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const headerTitle = t('eidRegister', 'EID Register Summary Section');

  return (
    <ListEncounter
      patientUuid={patientUuid}
      encounterUuid={EID_SUMMARY_ENCOUNTER_TYPE}
      form={{ package: 'uganda_emr_mch', name: 'eid_summary' }}
      columns={columns}
      description={headerTitle}
      headerTitle={headerTitle}
      displayText="Add"
    />
  );
};

export default EIDSummaryForm;
