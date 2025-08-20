import React from 'react';
import { useTranslation } from 'react-i18next';
import { StructuredListSkeleton, InlineLoading } from '@carbon/react';
import styles from './care-panel.scss';
import { usePatientPrograms } from '../hooks/usePatientPrograms';
import ProgramEnrollment from '../program-enrollment/program-enrollment-hiv.component';
import { ErrorState } from '@openmrs/esm-framework';
import { programs } from '../constants';
import CarePanelTabs from './care-panel-tabs/care-panel-tabs.component';
import { CardHeader } from '@openmrs/esm-patient-common-lib';

interface CarePanelProps {
  patientUuid: string;
  formEntrySub: any;
  launchPatientWorkspace: Function;
}

const CarePanel: React.FC<CarePanelProps> = ({ patientUuid, formEntrySub, launchPatientWorkspace }) => {
  const { t } = useTranslation();
  const { isLoading, error, enrollments } = usePatientPrograms(patientUuid);

  if (isLoading) {
    return (
      <div className={styles.widgetCard}>
        <StructuredListSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} headerTitle={t('carePanelError', 'Care panel')} />;
  }
  return (
    <div className={styles.widgetCard}>
      <CardHeader title={t('hivProgram', 'HIV Program')}>
        {isLoading && (
          <InlineLoading
            status="active"
            iconDescription={t('validating', 'Loading')}
            description={t('validating', 'Validating data...')}
          />
        )}
      </CardHeader>
      <div style={{ width: '100%', minHeight: '20rem' }}>
        <ProgramEnrollment
          patientUuid={patientUuid}
          programName={programs?.hiv}
          enrollments={enrollments}
          formEntrySub={formEntrySub}
          launchPatientWorkspace={launchPatientWorkspace}
          PatientChartProps={''}
        />
        <CarePanelTabs patientUuid={patientUuid} />
      </div>
    </div>
  );
};

export default CarePanel;
