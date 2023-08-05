import React, { useCallback, useState } from 'react';
import {
  Button,
  Dropdown,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Search,
  TextArea,
  TextInput,
} from '@carbon/react';
import styles from './create-dashboard-status.scss';
import { useTranslation } from 'react-i18next';
import { showToast } from '@openmrs/esm-framework';

interface CreateDashboardStatusProps {
  closeModal: () => void;
  onSaveChanges: (newTitle: string, newDescription: string) => void;
}

const CreateDashboardStatus: React.FC<CreateDashboardStatusProps> = ({ closeModal, onSaveChanges }) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleChanges = useCallback(
    (event) => {
      event.preventDefault();
      onSaveChanges(title, description);
      showToast({
        critical: true,
        title: t('updateEntry', 'Update entry'),
        kind: 'success',
        description: t('queueEntryUpdateSuccessfully', 'Queue Entry Updated Successfully'),
      });
    },
    [t, onSaveChanges, title, description],
  );

  const items = [
    {
      id: 'option-1',
      label: 'Bar Graph',
    },
    {
      id: 'option-2',
      label: 'Pie Chart',
    },
    {
      id: 'option-3',
      label: 'Column Chart',
    },
  ];

  return (
    <div>
      <Form onSubmit={handleChanges}>
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
              <Search placeholder="Search for tables, graphs, reports" style={{ backgroundColor: 'white' }} />
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
