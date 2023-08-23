import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@carbon/react';
import { TaskAdd } from '@carbon/react/icons';
import { formEntrySub, launchPatientWorkspace } from '@openmrs/esm-patient-common-lib';
import { ProgramActionButton } from '../types';
import { useLayoutType } from '@openmrs/esm-framework';

const ProgramActionButton: React.FC<ProgramActionButton> = ({ enrollment: result }) => {
  const { uuid, display, enrollment } = result;

  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const formUuid = enrollment.length ? enrollment[0].enrollmentFormUuid : uuid;

  const launchEnrollmentForm = (enrollmentStatus: string) => {
    formEntrySub.next({ formUuid, encounterUuid: '' });
    launchPatientWorkspace('programs-form-workspace', {
      workspaceTitle: `${display} ${enrollmentStatus} Form`,
    });
  };

  if (!enrollment.length) {
    return (
      <Button
        iconDescription={t('enrollProgram', 'Enroll to program')}
        onClick={() => launchEnrollmentForm(t('enrollment', 'Enrollment'))}
        renderIcon={(props) => <TaskAdd size={20} {...props} />}
        kind="tertiary"
        size={isTablet ? 'lg' : 'sm'}
        tooltipPosition="left"
      >
        {t('enroll', 'Enroll')}
      </Button>
    );
  }

  return (
    <Button
      iconDescription={t('discontinueEnrollment', 'Discontinue enrollment')}
      onClick={() => launchEnrollmentForm(t('discontinue', 'Discontinue'))}
      renderIcon={(props) => <TaskAdd size={20} {...props} />}
      kind="danger--ghost"
      size={isTablet ? 'lg' : 'sm'}
      tooltipPosition="left"
    >
      {t('discontinue', 'Discontinue')}
    </Button>
  );
};

export default ProgramActionButton;
