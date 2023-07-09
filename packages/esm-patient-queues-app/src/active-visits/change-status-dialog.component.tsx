import {
  Button,
  ContentSwitcher,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
} from '@carbon/react';
import {
  ConfigObject,
  navigate,
  showNotification,
  showToast,
  toDateObjectStrict,
  toOmrsIsoString,
  useConfig,
  useLocations,
  useSession,
} from '@openmrs/esm-framework';
import isEmpty from 'lodash-es/isEmpty';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDefaultLoginLocation } from '../patient-search/hooks/useDefaultLocation';
import { useQueueLocations } from '../patient-search/hooks/useQueueLocations';
import { useQueueRoomLocations } from '../patient-search/hooks/useQueueRooms';
import { MappedQueueEntry } from '../types';

import {
  updateQueueEntry,
  usePriority,
  useServices,
  useStatus,
  useVisitQueueEntries,
} from './active-visits-table.resource';
import styles from './change-status-dialog.scss';

interface ChangeStatusDialogProps {
  queueEntry: MappedQueueEntry;
  closeModal: () => void;
}

const ChangeStatus: React.FC<ChangeStatusDialogProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();

  const { defaultFacility, isLoading: loadingDefaultFacility } = useDefaultLoginLocation();

  const [priority, setPriority] = useState(queueEntry?.priorityUuid);
  const [newQueueUuid, setNewQueueUuid] = useState('');
  const { priorities } = usePriority();
  const config = useConfig() as ConfigObject;
  const [selectedQueueLocation, setSelectedQueueLocation] = useState(queueEntry?.queueLocation);
  const { services } = useServices(selectedQueueLocation);
  const { queueLocations } = useQueueLocations();
  const [editLocation, setEditLocation] = useState(false);
  const { mutate } = useVisitQueueEntries('', selectedQueueLocation);
  const { statuses } = useStatus();
  const [queueStatus, setQueueStatus] = useState(queueEntry?.statusUuid);

  const locations = useLocations();
  const sessionUser = useSession();

  const { queueRoomLocations } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);

  const changeQueueStatus = useCallback(
    (event) => {
      event.preventDefault();
      const endDate = toDateObjectStrict(toOmrsIsoString(new Date()));
      updateQueueEntry(
        queueEntry?.visitUuid,
        '86863db4-6101-4ecf-9a86-5e716d6504e4',
        'd2bf14fd-109a-4ca6-b61d-5d8cee9f94f1',
        queueEntry?.id,
        queueEntry?.patientUuid,
        priority,
        'pending',
        endDate,
      ).then(
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

            {/* <section className={styles.section}>
              <div className={styles.sectionTitle}>{t('queueService', 'Queue service')}</div>
              <Select
                labelText={t('selectService', 'Select a service')}
                id="service"
                invalidText="Required"
                value={newQueueUuid}
                onChange={(event) => setNewQueueUuid(event.target.value)}
              >
                {!newQueueUuid && editLocation === true ? (
                  <SelectItem text={t('selectService', 'Select a service')} value="" />
                ) : null}
                {!queueEntry.queueUuid ? <SelectItem text={t('selectService', 'Select a service')} value="" /> : null}
                {services?.length > 0 &&
                  services.map((service) => (
                    <SelectItem key={service.uuid} text={service.display} value={service.uuid}>
                      {service.display}
                    </SelectItem>
                  ))}
              </Select>
            </section> */}

            {/* <section className={styles.section}>
              <div className={styles.sectionTitle}>{t('queueStatus', 'Queue status')}</div>
              {!statuses?.length ? (
                <InlineNotification
                  className={styles.inlineNotification}
                  kind={'error'}
                  lowContrast
                  subtitle={t('configureStatus', 'Please configure status to continue.')}
                  title={t('noStatusConfigured', 'No status configured')}
                />
              ) : (
                <RadioButtonGroup
                  className={styles.radioButtonWrapper}
                  name="status"
                  defaultSelected={queueStatus}
                  onChange={(uuid) => {
                    setQueueStatus(uuid);
                  }}
                >
                  {statuses?.length > 0 &&
                    statuses.map(({ uuid, display }) => <RadioButton key={uuid} labelText={display} value={uuid} />)}
                </RadioButtonGroup>
              )}
            </section> */}

            <section className={styles.section}>
              <div className={styles.sectionTitle}>{t('queuePriority', 'Queue priority')}</div>
              <ContentSwitcher
                size="sm"
                selectedIndex={1}
                onChange={(event) => {
                  setPriority(event.name as any);
                }}
              >
                {priorities?.length > 0 ? (
                  priorities.map(({ uuid, display }) => {
                    return <Switch name={uuid} text={display} key={uuid} value={uuid} />;
                  })
                ) : (
                  <Switch
                    name={t('noPriorityFound', 'No priority found')}
                    text={t('noPriorityFound', 'No priority found')}
                    value={null}
                  />
                )}
              </ContentSwitcher>
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
