import { Button } from '@carbon/react';
import { ConfigObject, navigate, useConfig } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import usePatientId from './open-chart.resource';
import styles from './open-chart.scss';

interface OpenChartMenuProps {
  patientUuid: string;
}
const OpenChartMenu: React.FC<OpenChartMenuProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const { isLoading, patient } = usePatientId(patientUuid);
  const config = useConfig() as ConfigObject;

  const redirectPatientChart = useCallback(() => {
    if (!isLoading) {
      navigate({
        to: config.customPatientChartUrl
          ? `${config.customPatientChartUrl}=${patient?.patientId}&`
          : `\${openmrsSpaBase}/patient/${patientUuid}/chart`,
      });
    }
  }, [isLoading, config.customPatientChartUrl, patient?.patientId, patientUuid]);

  return (
    <Button onClick={redirectPatientChart} className={styles.editIcon} kind="ghost">
      {config.customPatientChartText ? config.customPatientChartText : t('profile', 'Profile')}
    </Button>
  );
};

export default OpenChartMenu;
