import React from 'react';
import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import { useTranslation } from 'react-i18next';
import { REFERRAL_NOTE_ENCOUNTER_TYPE } from '../../../constants';

const columns: EncounterListColumn[] = [
  {
    key: 'admissionDate',
    header: 'Admission Date',
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, '');
    },
  },
  {
    key: 'deliveryType',
    header: 'Delivery Type',
    getValue: (encounter) => {
      return getObsFromEncounter(encounter, '');
    },
  },
  {
    key: 'actions',
    header: 'Actions',
    getValue: () => {},
  },
];
const ReferralNote: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const headerTitle = t('referralNote', 'Referral Note');
  const displayText = t('referralNote', 'Referral Note');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterUuid={REFERRAL_NOTE_ENCOUNTER_TYPE}
      form={{
        package: 'uganda_emr_opd',
        name: 'referral_note',
      }}
      columns={columns}
      description={displayText}
      headerTitle={headerTitle}
      launchOptions={{
        hideFormLauncher: false,
        moduleName: '',
        displayText: 'Add',
      }}
    />
  );
};

export default ReferralNote;
