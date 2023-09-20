import React, { useEffect, useState } from 'react';
import { ActionableNotification } from '@carbon/react';
import { navigate, UserHasAccess } from '@openmrs/esm-framework';
import { useRetrieveFacilityCode } from './system-info.resources';
import { PRIVILEGE_UPDATE_FACILITY_CODE } from '../../constants';

const UpdateFacilityCodeAlert = () => {
  const [showAlert, setShowAlert] = useState(false);

  const { facilityIds, isLoading, isError } = useRetrieveFacilityCode();

  useEffect(() => {
    if (facilityIds && facilityIds.length) {
      console.info(facilityIds[0]);
      if (facilityIds[0]['value'] === null) {
        setShowAlert(true);
      } else {
        setShowAlert(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facilityIds]);

  if (showAlert) {
    return (
      <UserHasAccess privilege={PRIVILEGE_UPDATE_FACILITY_CODE}>
        <ActionableNotification
          actionButtonLabel="Go to System Page"
          aria-label="closes notification"
          onActionButtonClick={() => navigate({ to: '${openmrsSpaBase}/about' })}
          onClose={function noRefCheck() {}}
          // onCloseButtonClick={function noRefCheck() {}}
          inline={true}
          statusIconDescription="notification"
          role="alert"
          kind="warning"
          subtitle="Check system information page to ensure the facility details are upto date"
          title="Update Facility Information"
        />
      </UserHasAccess>
    );
  }
};

export default UpdateFacilityCodeAlert;
