import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StartVisitForm from '../components/visit-form/visit-form.component';
import { Button } from '@carbon/react';

interface StartVisitFormProps {
  patientUuid?: string;
}

const StartVisitButton: React.FC<StartVisitFormProps> = ({ patientUuid }) => {
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
          closePanel={() => setShowOverlay(false)}
          patientUuid={patientUuid}
        />
      )}
    </>
  );
};

export default StartVisitButton;
