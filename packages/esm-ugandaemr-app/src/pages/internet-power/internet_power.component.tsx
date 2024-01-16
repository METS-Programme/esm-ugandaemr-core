import React, { useState } from 'react';
import { Dropdown, Modal, RadioButtonGroup, RadioButton, TextInput } from '@carbon/react';
import styles from './internet-power.scss';
import { useTranslation } from 'react-i18next';

interface InternetPowerModalProps {
  closeModal: () => void;
}

const InternetPowerModal: React.FC<InternetPowerModalProps> = ({ closeModal }) => {
  const { t } = useTranslation();
  const [selectedInterConnection, setSelectedInternetConnection] = useState<string>('');

  const [selectedInternetAvailability, setInternetAvailability] = useState<string>('');
  const [showinternetAvailability, setshowinternetAvailability] = useState(false);

  const handleInternetConnectionChange = (value: string) => {
    setSelectedInternetConnection(value);
  };

  const handleInternetAvailability = (value: string) => {
    setInternetAvailability(value);
    setshowinternetAvailability(value === 'yes');
  };

  const items = [
    {
      id: 'option-1',
      text: 'National fiber optic connection (NITA-U)',
    },
    {
      id: 'option-2',
      text: 'Internet service provide (e.g. Airtel)',
    },
    {
      id: 'option-2',
      text: 'Dongles (e.g. Modem)',
    },
    {
      id: 'option-2',
      text: 'No internet connection',
    },
  ];

  const handleAddDetails = () => {
    closeModal();
  };
  return (
    <div className={styles.modalContainer}>
      <Modal
        open
        size="md"
        modalHeading="Add details"
        primaryButtonText="Submit"
        secondaryButtonText="Cancel"
        onRequestClose={closeModal}
        onRequestSubmit={handleAddDetails}
      >
        <div className={styles.modalContent}>
          <RadioButtonGroup legendText="Power Backup Solution" name="power">
            <RadioButton labelText="Solar" value="radio-2" id="radio-1" />
            <RadioButton labelText="Generator" value="radio-3" id="radio-2" />
          </RadioButtonGroup>
        </div>
        <div className={styles.modalContent}>
          <RadioButtonGroup
            legendText="Internet available at the facility"
            name="internet"
            valueSelected={selectedInternetAvailability}
            onChange={handleInternetAvailability}
          >
            <RadioButton labelText="Yes" value="yes" id="yes" />
            <RadioButton labelText="No" value="no" id="no" />
          </RadioButtonGroup>
        </div>

        {showinternetAvailability && (
          <div className={styles.modalContent}>
            <Dropdown
              id="internetConnection"
              titleText={t('internetAccess', 'Internet Access')}
              initialSelectedItem={items[0]}
              items={items}
              itemToString={(item) => (item ? item.text : '')}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InternetPowerModal;
