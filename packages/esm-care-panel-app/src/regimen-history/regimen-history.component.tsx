import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@openmrs/esm-patient-common-lib';
import { usePatient } from '@openmrs/esm-framework';
import { configSchema } from '../config-schema';

interface regimenHistoryProps {
  patientUuid: string;
}

const RegimenHistory: React.FC<regimenHistoryProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { patient } = usePatient(patientUuid);
  const observationConfig = useMemo(
    () => [
      {
        key: 'regimenChangeAction',
        uuidConfig: configSchema.regimenChangeActionUuid._default,
      },
      {
        key: 'priorArvRegimen',
        uuidConfig: configSchema.priorArvRegimenUuid._default,
      },
      {
        key: 'currentArvRegimen',
        uuidConfig: configSchema.currentRegimenUuid._default,
      },
    ],
    [],
  );

  const regimenHistoryConceptUuids = observationConfig.map((config) => config.uuidConfig);

  return <EmptyState displayText={'Regimen History'} headerTitle={'Regimen History'} />;
};

export default RegimenHistory;
