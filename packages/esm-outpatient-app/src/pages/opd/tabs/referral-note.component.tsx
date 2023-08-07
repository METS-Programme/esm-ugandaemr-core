import { EncounterList, EncounterListColumn, getObsFromEncounter } from '@ohri/openmrs-esm-ohri-commons-lib';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { moduleName, REFERRAL_NOTE_ENCOUNTER_TYPE } from '../../../constants';

interface ReferralNoteProps {
  patientUuid: string;
}
 
const ReferralNote: React.FC<ReferralNoteProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const columnsLab: EncounterListColumn[] = useMemo(
    () => [
      {
        key: 'admissionDate',
        header: t('admissionDate', 'Admission Date'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, "");
        },
      },
      {
        key: 'deliveryType',
        header: t('deliveryType', 'Delivery Type'),
        getValue: (encounter) => {
          return getObsFromEncounter(encounter, "")
        },
      }, 

      {
        key: 'actions',
        header: t('actions', 'Actions'),
        getValue: (encounter) => {
          const baseActions = [
            {
              form: { name: 'referral_note', package: 'uganda_emr_opd' },
              encounterUuid: encounter.uuid,
              intent: '*',
              label: 'View Details',
              mode: 'view',
            },
            {
              form: { name: 'referral_note', package: 'uganda_emr_opd' },
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
    [],
  ); 

  const headerTitle = t('referralNote', 'Referral Note');
  const displayText = t('referralNote', 'Referral Note');

  return (
    <EncounterList
      patientUuid={patientUuid}
      encounterType={REFERRAL_NOTE_ENCOUNTER_TYPE}
      formList={[{name: 'referral_note'}]}
      columns={columnsLab}
      description={displayText}
      headerTitle={headerTitle}
      launchOptions={{
        hideFormLauncher: false,
        moduleName: moduleName,
        displayText: 'Add',
      }}
    />
  );
};

export default ReferralNote;
