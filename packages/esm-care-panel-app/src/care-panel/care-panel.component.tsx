import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StructuredListSkeleton, ContentSwitcher, Switch } from '@carbon/react';
import styles from './care-panel.scss';
import { useEnrollmentHistory } from '../hooks/useEnrollmentHistory';
import ProgramSummary from '../program-summary/program-summary.component';
import ProgramEnrollment from '../program-enrollment/program-enrollment.component';
import { CardHeader, EmptyState } from '@openmrs/esm-patient-common-lib';
import RegimenHistory from '../regimen/regimen-history.component';
import first from 'lodash/first';
import sortBy from 'lodash/sortBy';
import { ErrorState } from '@openmrs/esm-framework';
import CarePrograms from '../care-programs/care-programs.component';

interface CarePanelProps {
  patientUuid: string;
  formEntrySub: any;
  launchPatientWorkspace: Function;
}

type SwitcherItem = {
  index: number;
  display?: string;
  text?: string;
};

const CarePanel: React.FC<CarePanelProps> = ({ patientUuid, formEntrySub, launchPatientWorkspace }) => {
  const { t } = useTranslation();
  // Destructure the result of useEnrollmentHistory directly
  const { isLoading, error, enrollments } = useEnrollmentHistory(patientUuid);

  // Use Object.keys(enrollments || {}) to get an array of keys and sort them
  const switcherHeaders = sortBy(Object.keys(enrollments || {}));

  const [switchItem, setSwitcherItem] = useState<SwitcherItem>({ index: 0 });

  // Use optional chaining to safely access properties
  const selectedHeader = switchItem?.display || first(switcherHeaders);

  const patientEnrollments = useMemo(
    () => (isLoading ? [] : enrollments[selectedHeader]),
    [enrollments, isLoading, selectedHeader],
  );
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
      <>
        <EmptyState displayText={t('carePanel', 'care panel')} headerTitle={t('carePanel', 'Care panel')} />
        <div className={styles.careProgramContainer}>
          <CarePrograms patientUuid={patientUuid} />
        </div>
      </>
    );
  }
  return (
    <>
      <div className={styles.widgetCard}>
        <CardHeader title={t('carePanel', 'Care Panel')}>
          <div className={styles.contextSwitcherContainer}>
            <ContentSwitcher selectedIndex={switchItem?.index} onChange={setSwitcherItem}>
              {switcherHeaders?.map((enrollmentKey, index) => (
                <Switch
                  key={enrollmentKey}
                  name={enrollmentKey}
                  text={enrollments[enrollmentKey]?.display || enrollmentKey}
                />
              ))}
            </ContentSwitcher>
          </div>
        </CardHeader>
        <div style={{ width: '100%', minHeight: '20rem' }}>
          <ProgramSummary patientUuid={patientUuid} programName={selectedHeader} />
          <RegimenHistory patientUuid={patientUuid} category={selectedHeader} />
          <ProgramEnrollment
            patientUuid={patientUuid}
            programName={selectedHeader}
            enrollments={patientEnrollments}
            formEntrySub={formEntrySub}
            launchPatientWorkspace={launchPatientWorkspace}
          />

          <CarePrograms patientUuid={patientUuid} />
        </div>
      </div>
    </>
  );
};

export default CarePanel;
