import React from 'react';
import { EmptyStateComingSoon } from '@ohri/openmrs-esm-ohri-commons-lib/src/index';
import { useTranslation } from 'react-i18next';

export interface SMSReminderEnrollmentProps {
  patientUuid: string;
}

const SMSReminderEnrollment: React.FC<SMSReminderEnrollmentProps> = ({ patientUuid }) => {
  const headerTitle = 'SMS Reminder Enrollment';

  return <EmptyStateComingSoon headerTitle={headerTitle} displayText={headerTitle} />;
};

export default SMSReminderEnrollment;