import { Button } from '@carbon/react';
import { showModal } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Add } from '@carbon/react/icons';

const UpdateFacilityCode = ({ setFacilityCode, facilityCode }) => {
  const { t } = useTranslation();
  const launchRetrieveFacilityCodeModal = useCallback(() => {
    const dispose = showModal('retrieve-facility-code-modal', {
      closeModal: () => dispose(),
      setFacilityCode,
    });
  }, [setFacilityCode]);

  if (facilityCode === '-') {
    return (
      <Button
        kind="ghost"
        size="sm"
        onClick={launchRetrieveFacilityCodeModal}
        iconDescription={t('updateFacilityCode', 'Update Facility Code')}
        renderIcon={(props) => <Add size={16} {...props} />}
      >
        {t('updateFacilityCode', 'Update Facility Code')}
      </Button>
    );
  }
};

export default UpdateFacilityCode;
