import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StructuredListSkeleton, ContentSwitcher, Switch } from '@carbon/react';
import styles from './care-panel.scss';
import { usePatientPrograms } from '../hooks/usePatientPrograms';
import ProgramEnrollment from '../program-enrollment/program-enrollment.component';
import { CardHeader, EmptyState } from '@openmrs/esm-patient-common-lib';
import { ErrorState } from '@openmrs/esm-framework';
import CarePrograms from '../care-programs/care-programs.component';

interface CarePanelProps {
  patientUuid: string;
  formEntrySub: any;
  launchPatientWorkspace: Function;
}

type SwitcherItem = {
  index: number;
  name?: string;
  text?: string;
};

const CarePanel: React.FC<CarePanelProps> = ({ patientUuid, formEntrySub, launchPatientWorkspace }) => {
  const { t } = useTranslation();
  const [programEnrolled, setProgramEnrolled] = useState('TB Program');
  const { isLoading, error, enrollments } = usePatientPrograms(patientUuid);
  const switcherHeaders = enrollments?.map((item) => item.program.name);
  const [switchItem, setSwitcherItem] = useState<SwitcherItem>();
  const programs = {
    hiv: 'HIV Program',
    tb: 'TB Program',
    mch: 'MCH Program',
    nutrition: 'Nutrition Program',
  };
  const handleItemTabChange = (name) => {
    setProgramEnrolled(name);
  };
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

  if (Object.keys(enrollments).length === 0) {
    return (
      <div className={styles.careProgramContainer}>
        <CarePrograms patientUuid={patientUuid} />
      </div>
    );
  }
  return (
    <>
      <div className={styles.widgetCard}>
        <CardHeader title={t('carePanel', 'Care Panel')}>
          <div className={styles.contextSwitcherContainer}>
            <ContentSwitcher onChange={(event) => handleItemTabChange(event.name)}>
              {switcherHeaders?.map((enrollment, index) => (
                <Switch key={enrollment} name={enrollment} text={enrollment} />
              ))}
            </ContentSwitcher>
          </div>
        </CardHeader>
        <div style={{ width: '100%', minHeight: '20rem' }}>
          {programEnrolled === programs.hiv && (
            <ProgramEnrollment
              patientUuid={patientUuid}
              programName={switchItem?.name}
              enrollments={enrollments}
              formEntrySub={formEntrySub}
              launchPatientWorkspace={launchPatientWorkspace}
              PatientChartProps={''}
            />
          )}
          {programEnrolled === programs.tb && (
            <div className={styles.emptyState}>
              <span>No data to display for this program</span>
            </div>
          )}
        </div>
      </div>
      <CarePrograms patientUuid={patientUuid} />
    </>
  );
};

export default CarePanel;
