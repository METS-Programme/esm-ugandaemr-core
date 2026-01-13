import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLaunchWorkspaceRequiringVisit } from '@openmrs/esm-patient-common-lib';
import { Link } from '@carbon/react';
import styles from './standard-regimen.scss';
import { launchWorkspace2 } from '@openmrs/esm-framework';

interface RegimenButtonProps {
  patientUuid: string;
}

const RegimenButton: React.FC<RegimenButtonProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const launchFormsWorkspace = useLaunchWorkspaceRequiringVisit('patient-form-entry-workspace');

  const launchPatientWorkspaceCb = () => {
    launchFormsWorkspace();
  };

  return (
    <>
      <Link
        className={styles.linkName}
        onClick={() =>
          launchWorkspace2('patient-form-entry-workspace', {
            formInfo: {
              formUuid: '53a3850c-855a-11eb-8dcd-0242ac130003',
              patientUuid,
            },
            workspaceTitle: 'Clinical Form',
          })
        }
      >
        {t('editRegimen', 'Change Regimen')}
      </Link>
    </>
  );
};

export default RegimenButton;
