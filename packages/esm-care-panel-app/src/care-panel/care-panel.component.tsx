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
  const { isLoading, error, enrollments } = useEnrollmentHistory(patientUuid);

  const enrolmentPrograms = enrollments.map((item, index) => {
    const program: SwitcherItem = {
      index: index,
      display: item.display,
      text: item.display,
    };
    return program;
  });

  console.info('info here--->', enrolmentPrograms);

  // const switcherHeaders = sortBy(Object.keys(enrolmentPrograms || {}));
  const [switchItem, setSwitcherItem] = useState<SwitcherItem>({ index: 0 });
  // const patientEnrollments = useMemo(
  //   () => (isLoading ? [] : enrolmentPrograms[switchItem?.display]),
  //   [enrolmentPrograms, isLoading, switchItem?.display],
  // );

  // console.info('eerr-->', patientEnrollments);

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

  if (enrolmentPrograms.length === 0) {
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
              {enrolmentPrograms?.map((enrollment) => (
                <Switch key={enrollment.index} name={enrollment.display} text={enrollment.text} />
              ))}
            </ContentSwitcher>
          </div>
        </CardHeader>
        <div style={{ width: '100%', minHeight: '20rem' }}>
          {/* <ProgramSummary patientUuid={patientUuid} programName={enrolmentPrograms[switchItem?.display]} /> */}
          {/* <RegimenHistory patientUuid={patientUuid} category={enrolmentPrograms[switchItem?.display]} /> */}
          <ProgramEnrollment
            patientUuid={patientUuid}
            programName={enrolmentPrograms[switchItem?.display]}
            enrollments={enrollments}
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
