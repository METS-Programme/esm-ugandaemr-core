import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StartVisitForm from './visit-form/visit-form.component';
import { Button } from '@carbon/react';
import { usePatient } from '@openmrs/esm-framework';

interface StartVisitFormProps {
  patientUuid? : string
}

const StartVisitButton: React.FC<StartVisitFormProps> = ({ patientUuid  }) => {
  const { t } = useTranslation();
  const [showOverlay, setShowOverlay] = useState(false);
  const handleClick = () => {
    setShowOverlay(true);
  };

  return (
    <>
      <Button onClick={handleClick}>{t('startAVisit', 'Start a Visit')}</Button>
      {showOverlay && (
        <StartVisitForm
          header={t('startAVisit', 'Start a Visit')}
          closePanel={() => true}
          patientUuid={patientUuid}
        />
      )}
    </>
  );
};

export default StartVisitButton;
