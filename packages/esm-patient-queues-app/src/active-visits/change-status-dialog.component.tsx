import { Button, Form, ModalBody, ModalFooter, ModalHeader, Select, SelectItem, TextArea } from '@carbon/react';
import {
  navigate,
  showNotification,
  showToast,
  toDateObjectStrict,
  toOmrsIsoString,
  useSession
} from '@openmrs/esm-framework';
import isEmpty from 'lodash-es/isEmpty';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDefaultLoginLocation } from '../patient-search/hooks/useDefaultLocation';
import { useQueueRoomLocations } from '../patient-search/hooks/useQueueRooms';
import { MappedQueueEntry } from '../types';

import {
  updateQueueEntry,
  useVisitQueueEntries
} from './active-visits-table.resource';
import styles from './change-status-dialog.scss';

interface ChangeStatusDialogProps {
  queueEntry: MappedQueueEntry;
  closeModal: () => void;
}

const ChangeStatus: React.FC<ChangeStatusDialogProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();

  const { defaultFacility, isLoading: loadingDefaultFacility } = useDefaultLoginLocation();

  const [selectedQueueLocation, setSelectedQueueLocation] = useState(queueEntry?.queueLocation);
  const { mutate } = useVisitQueueEntries('', selectedQueueLocation);

  const sessionUser = useSession();

  const { queueRoomLocations } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);

  const changeQueueStatus = useCallback(
    (event) => {
      event.preventDefault();
      const endDate = toDateObjectStrict(toOmrsIsoString(new Date()));
      updateQueueEntry('', '', '', '', '', '', '', '', endDate).then(
        ({ status }) => {
          if (status === 201) {
            showToast({
              critical: true,
              title: t('updateEntry', 'Update entry'),
              kind: 'success',
              description: t('queueEntryUpdateSuccessfully', 'Queue Entry Updated Successfully'),
            });
            closeModal();
            mutate();
            navigate({ to: `${window.spaBase}/home/patient-queues` });
          }
        },
        (error) => {
          showNotification({
            title: t('queueEntryUpdateFailed', 'Error updating queue entry status'),
            kind: 'error',
            critical: true,
            description: error?.message,
          });
        },
      );
    },
    [
      queueEntry?.visitUuid,
      queueEntry?.queueUuid,
      queueEntry?.queueEntryUuid,
      queueEntry?.patientUuid,
      t,
      closeModal,
      mutate,
    ],
  );

  if (Object.keys(queueEntry)?.length === 0) {
    return <ModalHeader closeModal={closeModal} title={t('patientNotInQueue', 'The patient is not in the queue')} />;
  }

  if (Object.keys(queueEntry)?.length > 0) {
    return (
      <div>
        <Form onSubmit={changeQueueStatus}>
          <ModalHeader
            closeModal={closeModal}
            title={t('movePatientToNextQueueRoom', 'Move patient to the next queue room?')}
          />
          <ModalBody>
            <div className={styles.modalBody}>
              <h5>
                {queueEntry.name} &nbsp; · &nbsp;{queueEntry.patientSex} &nbsp; · &nbsp;{queueEntry.patientAge}&nbsp;
                {t('years', 'Years')}
              </h5>
            </div>
            <section>
              <Select
                labelText={t('selectNextQueueRoom', 'Select next queue room ')}
                id="nextQueueLocation"
                name="nextQueueLocation"
                invalidText="Required"
                value={selectedNextQueueLocation}
                onChange={(event) => setSelectedNextQueueLocation(event.target.value)}
              >
                {!selectedNextQueueLocation ? (
                  <SelectItem text={t('selectNextQueueRoom', 'Select next queue room ')} value="" />
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
            </section>

            <section>
              <TextArea
                labelText={t('notes', 'Enter notes ')}
                id="nextNotes"
                name="nextNotes"
                invalidText="Required"
                helperText="Please enter notes"
                maxCount={500}
                enableCounter
              />
            </section>
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={closeModal}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button type="submit">{t('moveToNextQueue', 'Move to next queue room')}</Button>
          </ModalFooter>
        </Form>
      </div>
    );
  }
};

export default ChangeStatus;
