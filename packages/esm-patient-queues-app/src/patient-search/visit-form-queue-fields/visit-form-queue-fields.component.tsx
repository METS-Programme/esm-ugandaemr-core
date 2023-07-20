import { InlineNotification, Layer, RadioButton, RadioButtonGroup, Select, SelectItem, TextInput } from '@carbon/react';
import { ConfigObject, useConfig, useLayoutType, useSession } from '@openmrs/esm-framework';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePriority, useStatus } from '../../active-visits/active-visits-table.resource';
import { useServices } from '../../patient-queue-metrics/queue-metrics.resource';
import { useQueueRoomLocations } from '../../patient-search/hooks/useQueueRooms'; //patient-search/hooks/useQueueRooms
import { useQueueLocations } from '../hooks/useQueueLocations';
import styles from './visit-form-queue-fields.scss';

const StartVisitQueueFields: React.FC = () => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const userSession = useSession();

  const { priorities } = usePriority();
  const { statuses } = useStatus();
  const { queueLocations } = useQueueLocations();
  const config = useConfig() as ConfigObject;
  const defaultStatus = config.concepts.defaultStatusConceptUuid;
  const defaultPriority = config.concepts.defaultPriorityConceptUuid;
  const emergencyPriorityConceptUuid = config.concepts.emergencyPriorityConceptUuid;
  const { queueRoomLocations } = useQueueRoomLocations(userSession?.sessionLocation?.uuid);

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);
  const { allServices, isLoading } = useServices(selectedNextQueueLocation);
  const [priority, setPriority] = useState(defaultPriority);
  const [status, setStatus] = useState(defaultStatus);
  const [sortWeight, setSortWeight] = useState(0);
  const [service, setSelectedService] = useState('');

  useEffect(() => {
    if (priority === emergencyPriorityConceptUuid) {
      setSortWeight(1);
    }
  }, [priority]);

  useEffect(() => {
    if (queueRoomLocations?.length > 0) {
      setSelectedService(queueRoomLocations[0].uuid);
    }
  }, [queueRoomLocations]);

  useEffect(() => {
    if (queueLocations?.length > 0) {
      setSelectedNextQueueLocation(queueLocations[0].id);
    }
  }, [queueLocations]);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <div className={styles.sectionTitle}>{t('nextServicePoint', 'Next Service Point')}</div>
        <ResponsiveWrapper isTablet={isTablet}>
          <Select
            labelText={t('selectNextServicePoint', 'Select next service point')}
            id="queueLocation"
            name="queueLocation"
            invalidText="Required"
            value={selectedNextQueueLocation}
            onChange={(event) => setSelectedNextQueueLocation(event.target.value)}
          >
            {!selectedNextQueueLocation ? (
              <SelectItem text={t('selectNextServicePoint', 'Select next service point')} value="" />
            ) : null}
            {queueRoomLocations?.length > 0 &&
              queueRoomLocations.map((location) => (
                <SelectItem key={location.uuid} text={location.display} value={location.uuid}>
                  {location.display}
                </SelectItem>
              ))}
          </Select>
        </ResponsiveWrapper>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>{t('service', 'Service')}</div>
        {!allServices?.length ? (
          <InlineNotification
            className={styles.inlineNotification}
            kind={'error'}
            lowContrast
            subtitle={t('configureServices', 'Please configure services to continue.')}
            title={t('noServicesConfigured', 'No services configured')}
          />
        ) : (
          <Select
            labelText={t('selectService', 'Select a service')}
            id="service"
            name="service"
            invalidText="Required"
            value={service}
            onChange={(event) => setSelectedService(event.target.value)}
          >
            {!service ? <SelectItem text={t('selectService', 'Select a queue service')} value="" /> : null}
            {allServices?.length > 0 &&
              allServices.map((service) => (
                <SelectItem key={service.uuid} text={service.name} value={service.uuid}>
                  {service.name}
                </SelectItem>
              ))}
          </Select>
        )}
      </section>

      <section className={`${styles.section} ${styles.sectionHidden}`}>
        <div className={styles.sectionTitle}>{t('status', 'Status')}</div>
        <Select
          labelText={t('selectStatus', 'Select a status')}
          id="status"
          name="status"
          invalidText="Required"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {!statuses ? <SelectItem text={t('chooseStatus', 'Select a status')} value="" /> : null}
          {statuses?.length > 0 &&
            statuses.map((status) => (
              <SelectItem key={status.uuid} text={status.display} value={status.uuid}>
                {status.display}
              </SelectItem>
            ))}
        </Select>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTitle}>{t('priority', 'Priority')}</div>
        {!priorities?.length ? (
          <InlineNotification
            className={styles.inlineNotification}
            kind={'error'}
            lowContrast
            subtitle={t('configurePriorities', 'Please configure priorities to continue.')}
            title={t('noPrioritiesConfigured', 'No priorities configured')}
          />
        ) : (
          <RadioButtonGroup
            className={styles.radioButtonWrapper}
            name="priority"
            id="priority"
            defaultSelected={defaultPriority}
            onChange={(uuid) => {
              setPriority(uuid);
            }}
          >
            {priorities?.length > 0 &&
              priorities.map(({ uuid, display }) => <RadioButton key={uuid} labelText={display} value={uuid} />)}
          </RadioButtonGroup>
        )}
      </section>

      <section className={`${styles.section} ${styles.sectionHidden}`}>
        <TextInput
          type="number"
          id="sortWeight"
          name="sortWeight"
          labelText={t('sortWeight', 'Sort weight')}
          value={sortWeight}
        />
      </section>
    </div>
  );
};

function ResponsiveWrapper({ children, isTablet }) {
  return isTablet ? <Layer>{children}</Layer> : <div>{children}</div>;
}

export default StartVisitQueueFields;
