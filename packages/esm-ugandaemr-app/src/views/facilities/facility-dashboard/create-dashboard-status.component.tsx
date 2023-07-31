import React from 'react';
import {
  Button,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  RadioButton,
  RadioButtonGroup,
  Search,
  TextArea,
  TextInput,
} from '@carbon/react';
import styles from './create-dashboard-status.scss';
import { useTranslation } from 'react-i18next';

interface CreateDashboardStatusProps {
  closeModal: () => void;
}

const CreateDashboardStatus: React.FC<CreateDashboardStatusProps> = ({ closeModal }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Form>
        <ModalHeader closeModal={closeModal} title={t('dashboarddetails', 'Dashboard Details')} />
        <ModalBody>
          <div className={styles.modalBody}>
            <section className={styles.section}>
              <div className={styles.sectionTitle}>{t('dashboardTitle', 'Dashboard Title')}</div>
              <TextInput
                id="title"
                maxCount={50}
                placeholder="Enter dashboard title"
                style={{ backgroundColor: 'white' }}
              />
            </section>
            <section className={styles.section}>
              <div className={styles.sectionTitle}>{t('dashboardDescription', 'Dashboard Description')}</div>
              <TextArea
                id="description"
                maxCount={500}
                placeholder="Enter dashboard description"
                style={{ backgroundColor: 'white' }}
              />
            </section>
            <section className={styles.section}>
              <div className={styles.sectionTitle}>
                {t('searchItemDashboard', 'Search for item to add on the dashboard')}
              </div>
              <Search placeholder="Search for tables, graphs," style={{ backgroundColor: 'white' }} />
            </section>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={closeModal}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button type="submit">{t('saveChanges', 'Save Changes')}</Button>
        </ModalFooter>
      </Form>
    </div>
  );
};

export default CreateDashboardStatus;
