import React from 'react';
import LaboratoryResultsTabs from './laboratory-tabs/laboratory-order-tabs.component';

interface PatientLaboratoryOrderResultsProps {
  patientUuid: string;
}

const PatientLaboratoryOrderResults: React.FC<PatientLaboratoryOrderResultsProps> = ({ patientUuid }) => {
  return <LaboratoryResultsTabs patientUuid={patientUuid} />;
};

export default PatientLaboratoryOrderResults;
