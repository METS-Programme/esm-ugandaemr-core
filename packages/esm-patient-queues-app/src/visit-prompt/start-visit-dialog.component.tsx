import { Button, Layer, ModalBody, ModalFooter, ModalHeader, Select, SelectItem } from '@carbon/react';
import { useLayoutType, useLocations, useSession } from '@openmrs/esm-framework';
import isEmpty from 'lodash-es/isEmpty';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MappedPatientQueueEntry } from '../active-visits/patient-queues.resource';
import { useDefaultLoginLocation } from '../patient-search/hooks/useDefaultLocation';
import { useQueueRoomLocations } from '../patient-search/hooks/useQueueRooms';

import styles from './start-visit-dialog.scss';

interface StartVisitDialogProps {
  queueEntry: MappedPatientQueueEntry;
  closeModal: () => void;
  launchPatientChart?: boolean;
}

const StartVisitDialog: React.FC<StartVisitDialogProps> = ({ queueEntry, closeModal, launchPatientChart }) => {
  const { defaultFacility, isLoading: loadingDefaultFacility } = useDefaultLoginLocation();
  const isTablet = useLayoutType() === 'tablet';
  const locations = useLocations();
  const sessionUser = useSession();
  const { queueRoomLocations } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);
  const { t } = useTranslation();

  return (
    <div>
      <ModalHeader closeModal={closeModal}>Patient : {queueEntry?.name}</ModalHeader>
      <ModalBody>
        <section></section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>{t('nextServicePoint', 'Next Service Point')}</div>
          <ResponsiveWrapper isTablet={isTablet}>
            <Select
              labelText={t('selectNextServicePoint', 'Select next service point')}
              id="nextQueueLocation"
              name="nextQueueLocation"
              invalidText="Required"
              value={selectedNextQueueLocation}
              onChange={(event) => setSelectedNextQueueLocation(event.target.value)}
            >
              {!selectedNextQueueLocation ? (
                <SelectItem text={t('selectNextServicePoint', 'Select next service point')} value="" />
              ) : null}
              {!isEmpty(defaultFacility) ? (
                <SelectItem key={defaultFacility?.uuid} text={defaultFacility?.display} value={defaultFacility?.uuid}>
                  {defaultFacility?.display}
                </SelectItem>
              ) : queueRoomLocations?.length > 0 ? (
                queueRoomLocations.map((location) => (
                  <SelectItem key={location.uuid} text={location.display} value={location.uuid}>
                    {location.display}
                  </SelectItem>
                ))
              ) : null}
            </Select>
          </ResponsiveWrapper>
        </section>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="primary">{t('sendToNextQueue', 'Send to Next Queue')}</Button>
      </ModalFooter>
    </div>
  );
};
function ResponsiveWrapper({ children, isTablet }) {
  return isTablet ? <Layer>{children}</Layer> : <div>{children}</div>;
}
export default StartVisitDialog;
