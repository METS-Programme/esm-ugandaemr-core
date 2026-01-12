import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StartVisitForm from '../components/visit-form/start-a-visit-form.workspace';
import { Button } from '@carbon/react';
import { launchWorkspace, launchWorkspace2 } from '@openmrs/esm-framework';

interface StartVisitFormProps {
  patientUuid: string;
}

const StartVisitButton: React.FC<StartVisitFormProps> = ({ patientUuid }) => {
  const { t } = useTranslation();

  const handleLaunchWorkspace = () => {
    launchWorkspace2('start-visit-form-workspace', {
      patientUuid,
    });
  };
  return (
    <Button onClick={handleLaunchWorkspace} aria-label={t('startAVisit', 'Start a Visit')}>
      {t('startAVisit', 'Start a Visit')}
    </Button>
  );
};

export default StartVisitButton;
