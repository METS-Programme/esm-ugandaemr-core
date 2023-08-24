import React from 'react';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import styles from '../../common.scss';
import PartnerNotificationList from './partner-notification.component';
import ContactTracingList from './tabs/contact-tracing.component';
import { useTranslation } from 'react-i18next';
import SMSReminderEnrollment from './tabs/sms-reminder-enrollment.component';

interface OverviewListProps {
  patientUuid: string;
}

const PartnerNotificationServices: React.FC<OverviewListProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tabContainer}>
      <Tabs>
        <TabList contained>
          <Tab className="tab-12rem">{t('partnerNotification', 'Partner Notification')}</Tab>
          <Tab>{t('contactTracing', 'Contact Tracing')}</Tab>
          <Tab>{t('smsEnrollment', 'SMS Remider Enrollment')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PartnerNotificationList patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <ContactTracingList patientUuid={patientUuid} />
          </TabPanel>
          <TabPanel>
            <SMSReminderEnrollment patientUuid={patientUuid} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default PartnerNotificationServices;
