import React from 'react';
import { useTranslation } from 'react-i18next';
import { launchPatientWorkspace, useLaunchWorkspaceRequiringVisit } from '@openmrs/esm-patient-common-lib';
import { Link } from '@carbon/react';
import styles from './standard-regimen.scss';

const RegimenButton: React.FC = () => {
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
          launchPatientWorkspace('patient-form-entry-workspace', {
            formInfo: {
              encounterUuid: '',
              formUuid: '835e6672-9693-4c07-98bc-a5a7804bdb5c',
            },
            workspaceTitle: 'Clinical Form',
          })
        }
      >
        {t('editRegimen', 'Edit')}
      </Link>
    </>
  );
};

export default RegimenButton;
