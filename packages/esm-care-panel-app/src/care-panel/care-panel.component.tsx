import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StructuredListSkeleton, ContentSwitcher, Switch } from '@carbon/react';
import styles from './care-panel.scss';
import { usePatientPrograms } from '../hooks/usePatientPrograms';
import ProgramEnrollment from '../program-enrollment/program-enrollment-hiv.component';
import { ErrorState } from '@openmrs/esm-framework';
import CarePrograms from '../care-programs/care-programs.component';
import ProgramEnrollmentTB from '../program-enrollment/program-enrollment-tb.component';
import { programs } from '../constants';
import { CardHeader } from '@openmrs/esm-patient-common-lib';
import CarePanelTabs from './care-panel-tabs/care-panel-tabs.component';

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
  const { isLoading, error, enrollments, dsdmModels } = usePatientPrograms(patientUuid);
  const switcherHeaders = enrollments?.map((item) => item.program.name) || [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [switchItem, setSwitcherItem] = useState<SwitcherItem>(() => {
    const firstEnrollment = enrollments?.[0];
    return firstEnrollment ? { index: 0, name: firstEnrollment.program.name } : undefined;
  });

  useEffect(() => {
    if (!switchItem && enrollments && enrollments.length > 0) {
      setSwitcherItem({ index: 0, name: enrollments[0].program.name });
    }
  }, [enrollments, switchItem]);

  const handleItemTabChange = (index: number, name?: string) => {
    const programName = enrollments?.[index]?.program?.name;
    const switcherItem = { index, name: programName };

    if (programName) {
      setSwitcherItem(switcherItem);
      setSelectedIndex(index);
    }
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
  return (
    <>
      {Object.keys(enrollments).length > 0 ? (
        <div className={styles.widgetCard}>
          <CardHeader title={t('carePanel', 'Care Panel')}>
            <div className={styles.contextSwitcherContainer}>
              <ContentSwitcher
                selectedIndex={selectedIndex}
                onChange={(event) => handleItemTabChange(event.index, event.name)}
              >
                {switcherHeaders?.map((enrollment, index) => (
                  <Switch key={enrollment} name={enrollment} text={enrollment} />
                ))}
              </ContentSwitcher>
            </div>
          </CardHeader>

          {switchItem?.name === programs.hiv && (
            <div style={{ width: '100%', minHeight: '20rem' }}>
              <ProgramEnrollment
                patientUuid={patientUuid}
                programName={switchItem?.name}
                enrollments={enrollments}
                formEntrySub={formEntrySub}
                launchPatientWorkspace={launchPatientWorkspace}
                PatientChartProps={''}
              />

              <CarePanelTabs patientUuid={patientUuid} />
            </div>
          )}
          {switchItem?.name === programs.tb && (
            <div style={{ width: '100%', minHeight: '20rem' }}>
              <ProgramEnrollmentTB
                patientUuid={patientUuid}
                programName={switchItem?.name}
                enrollments={enrollments}
                formEntrySub={formEntrySub}
                launchPatientWorkspace={launchPatientWorkspace}
                PatientChartProps={''}
              />
            </div>
          )}
        </div>
      ) : (
        <div className={styles.careProgramContainer}>
          <CarePrograms patientUuid={patientUuid} />
        </div>
      )}
      <CarePrograms patientUuid={patientUuid} />
    </>
  );
};

export default CarePanel;
