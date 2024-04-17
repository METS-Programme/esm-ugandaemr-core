import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StructuredListSkeleton, ContentSwitcher, Switch } from '@carbon/react';
import { CloudMonitoring, Medication, Stethoscope } from '@carbon/react/icons';
import styles from './care-panel.scss';
import { usePatientPrograms } from '../hooks/usePatientPrograms';
import ProgramEnrollment from '../program-enrollment/program-enrollment.component';
import { ErrorState } from '@openmrs/esm-framework';
import CarePrograms from '../care-programs/care-programs.component';
import ProgramEnrollmentTB from '../program-enrollment/program-enrollment-tb.component';
import { programs } from '../constants';
import DSDMHistory from '../dsdm-history/dsdm-history.component';
import RegimenHistory from '../regimen-history/regimen-history.component';

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
  const [selectedTab, setSelectedTab] = useState('carePanel');

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

  const handleChartTypeChange = ({ name }) => {
    setSelectedTab(name);
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
          <ContentSwitcher selectedIndex={0} onChange={handleChartTypeChange}>
            <Switch name="carePanel">
              <div className={styles.switch}>
                <CloudMonitoring />
                <span>Care Panel</span>
              </div>
            </Switch>
            <Switch name="dsdm">
              <div className={styles.switch}>
                <Stethoscope />
                <span>DSD Model History</span>
              </div>
            </Switch>
            <Switch name="regimenHistory">
              <div className={styles.switch}>
                <Medication />
                <span>Regimen History</span>
              </div>
            </Switch>
          </ContentSwitcher>

          {selectedTab === 'carePanel' && (
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
          )}

          {selectedTab === 'carePanel' && switchItem?.name === programs.hiv && (
            <div style={{ width: '100%', minHeight: '20rem' }}>
              <ProgramEnrollment
                patientUuid={patientUuid}
                programName={switchItem?.name}
                enrollments={enrollments}
                formEntrySub={formEntrySub}
                launchPatientWorkspace={launchPatientWorkspace}
                PatientChartProps={''}
              />
            </div>
          )}
          {selectedTab === 'carePanel' && switchItem?.name === programs.tb && (
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
          {selectedTab === 'dsdm' && dsdmModels && <DSDMHistory patientUuid={patientUuid} />}
          {selectedTab === 'regimenHistory' && <RegimenHistory />}
        </div>
      ) : (
        <div className={styles.careProgramContainer}>
          <CarePrograms patientUuid={patientUuid} />
        </div>
      )}
    </>
  );
};

export default CarePanel;
