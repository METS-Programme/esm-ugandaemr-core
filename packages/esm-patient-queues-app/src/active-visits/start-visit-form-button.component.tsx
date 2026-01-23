import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { launchWorkspace2 } from '@openmrs/esm-framework';

interface StartVisitFormProps {
  patientUuid: string;
}

const StartVisitButton: React.FC<StartVisitFormProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const handleLaunchWorkspace = () => {
    launchWorkspace2('patient-queues-start-visit-form-workspace', {
      patientUuid: patientUuid,
      showPatientHeader: true,
    });
  };

  return (
    <Button onClick={handleLaunchWorkspace} aria-label={t('startAVisit', 'Start a Visit')}>
      {t('startAVisit', 'Start a Visit')}
    </Button>
  );
};

export default StartVisitButton;
