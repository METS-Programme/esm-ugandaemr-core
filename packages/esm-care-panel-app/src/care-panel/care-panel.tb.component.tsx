import React from 'react';
import { useTranslation } from 'react-i18next';
import { StructuredListSkeleton, InlineLoading } from '@carbon/react';
import styles from './care-panel.scss';
import { usePatientPrograms } from '../hooks/usePatientPrograms';
import { ErrorState } from '@openmrs/esm-framework';
import ProgramEnrollmentTB from '../program-enrollment/program-enrollment-tb.component';
import { programs } from '../constants';
import { CardHeader } from '@openmrs/esm-patient-common-lib';

interface CarePanelProps {
  patientUuid: string;
  formEntrySub: any;
  launchPatientWorkspace: Function;
}

const CarePanelTB: React.FC<CarePanelProps> = ({ patientUuid, formEntrySub, launchPatientWorkspace }) => {
  const { t } = useTranslation();
  const { isLoading, error, enrollments } = usePatientPrograms(patientUuid);

  if (isLoading) {
    return (
      <div className={styles.widgetCard}>
        <StructuredListSkeleton role="progressbar" />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} headerTitle={t('carePanelError', 'Care panel')} />;
  }
  return (
    <div className={styles.widgetCard}>
      <CardHeader title={t('tbProgram', 'TB Program')}>
        {isLoading && (
          <InlineLoading
            status="active"
            iconDescription={t('validating', 'Loading')}
            description={t('validating', 'Validating data...')}
          />
        )}
      </CardHeader>
      <div style={{ width: '100%', minHeight: '20rem' }}>
        <ProgramEnrollmentTB
          patientUuid={patientUuid}
          programName={programs?.tb}
          enrollments={enrollments}
          formEntrySub={formEntrySub}
          launchPatientWorkspace={launchPatientWorkspace}
          PatientChartProps={''}
        />
      </div>
    </div>
  );
};

export default CarePanelTB;
