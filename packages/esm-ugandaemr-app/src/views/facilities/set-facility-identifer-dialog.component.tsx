import { Button, Form, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  updateSelectedFacilityIdentifier,
  updateSelectedFacilityName,
} from '../../../../esm-patient-queues-app/src/helpers/helpers';
import styles from './ug-emr-facilities.scss';

interface SetFacilityDialogProps {
  facility: string;
  status: string;
  uniqueIdentifier: string;
  closeModal: () => void;
}
const SetFacilityIdentifier: React.FC<SetFacilityDialogProps> = ({
  facility,
  status,
  uniqueIdentifier,
  closeModal,
}) => {
  const { t } = useTranslation();

  const setIdentifier = useMemo(() => {
    updateSelectedFacilityName(facility);
    updateSelectedFacilityIdentifier(uniqueIdentifier);
  }, [facility, uniqueIdentifier]);

  return (
    <div>
      <ModalHeader closeModal={closeModal} title={t('setIdentifier', 'Set Facility Identifier')} />
      <ModalBody>
        <Form onSubmit={setIdentifier}>
          <div className={styles.modalBody}>
            <div>
              <span> Facility Name : {facility} </span>
            </div>
            <div>
              <span> Facility Status : {status} </span>
            </div>
            <div>
              <span> Facility Identifer : {uniqueIdentifier}</span>
            </div>
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button>{t('save', 'Save')}</Button>
      </ModalFooter>
    </div>
  );
};

export default SetFacilityIdentifier;
