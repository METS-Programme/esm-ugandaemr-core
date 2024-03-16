import { Button } from '@carbon/react';
import { Add } from '@carbon/react/icons';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InternetPowerModal from './internet_power.component';

const UpdateInternetPowerButton = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const launchInternetPowerModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <Button
        kind="ghost"
        size="sm"
        onClick={launchInternetPowerModal}
        renderIcon={(props) => <Add size={16} {...props} />}
      >
        <span>Internet & Power Connectivity</span>
      </Button>

      {isModalOpen && <InternetPowerModal closeModal={closeModal} />}
    </>
  );
};

export default UpdateInternetPowerButton;
