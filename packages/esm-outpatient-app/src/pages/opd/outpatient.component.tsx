import React from 'react';
import { useTranslation } from 'react-i18next';
import { PatientChartProps } from '../../types';
import styles from '../common.scss';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import OutpatientRegister from './tabs/outpatient-register.component';
import ReferralNote from './tabs/referral-note.component';

const Outpatient: React.FC<PatientChartProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const pageTitle = t('opd', 'OutPatient Department');

  return (
    <div className={styles.tabContainer}>
      <Tabs>
        <TabList contained>
          <Tab>{t('opdRegister', 'OutPatient Register')}</Tab>
          <Tab>{t('referralNote', 'Referral Note')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <OutpatientRegister patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <ReferralNote patientUuid={patientUuid} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Outpatient;
