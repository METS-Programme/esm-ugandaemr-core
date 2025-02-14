import React, { useCallback, useEffect, useMemo, useState } from 'react';

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
  InlineLoading,
  TextArea,
  Layer,
  InlineNotification,
} from '@carbon/react';
import {
  navigate,
  parseDate,
  showNotification,
  showSnackbar,
  showToast,
  useLayoutType,
  useSession,
  useVisit,
} from '@openmrs/esm-framework';
import { addQueueEntry, getCareProvider, updateQueueEntry } from './active-visits-table.resource';
import { useTranslation } from 'react-i18next';
import { useQueueRoomLocations } from '../hooks/useQueueRooms';
import { MappedQueueEntry } from '../types';
import { ArrowUp, ArrowDown } from '@carbon/react/icons';
import styles from './change-status-dialog.scss';
import { QueueStatus, extractErrorMessagesFromResponse } from '../utils/utils';
import { updateVisit, useProviders } from './patient-queues.resource';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateQueueEntryFormData, createQueueEntrySchema } from './patient-queue-validation-schema.resource';

interface ChangeStatusDialogProps {
  queueEntry: MappedQueueEntry;
  currentEntry: MappedQueueEntry;
  closeModal: () => void;
}

const ChangeStatus: React.FC<ChangeStatusDialogProps> = ({ queueEntry, currentEntry, closeModal }) => {
  const { t } = useTranslation();

  const isTablet = useLayoutType() === 'tablet';

  const { providers, error: errorLoadingProviders } = useProviders();

  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(1);

  const [statusSwitcherIndex, setStatusSwitcherIndex] = useState(1);

  const [status, setStatus] = useState('');

  const sessionUser = useSession();

  const {
    queueRoomLocations,
    mutate,
    error: errorLoadingQueueRooms,
  } = useQueueRoomLocations(sessionUser?.sessionLocation?.uuid);

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);

  const [provider, setProvider] = useState('');

  const [priorityComment, setPriorityComment] = useState('');

  const [selectedProvider, setSelectedProvider] = useState('');

  const { activeVisit } = useVisit(queueEntry.patientUuid);

  const [isLoading, setIsLoading] = useState(true);

  // Memoize the function to fetch the provider using useCallback
  const fetchProvider = useCallback(() => {
    if (!sessionUser?.user?.uuid) return;

    setIsLoading(true);

    getCareProvider(sessionUser?.user?.uuid).then(
      (response) => {
        const uuid = response?.data?.results[0].uuid;
        setIsLoading(false);
        setProvider(uuid);
        mutate();
      },
      (error) => {
        const errorMessages = extractErrorMessagesFromResponse(error);
        setIsLoading(false);
        showNotification({
          title: "Couldn't get provider",
          kind: 'error',
          critical: true,
          description: errorMessages.join(','),
        });
      },
    );
  }, [sessionUser?.user?.uuid, mutate]);

  useEffect(() => fetchProvider(), [fetchProvider]);

  const priorityLabels = useMemo(() => ['Not Urgent', 'Urgent', 'Emergency'], []);

  const statusLabels = useMemo(
    () => [
      { status: 'pending', label: 'Move to Pending' },
      { status: 'completed', label: 'Move to Completed' },
    ],
    [],
  );

  const { handleSubmit, control, formState } = useForm<CreateQueueEntryFormData>({
    mode: 'all',
    resolver: zodResolver(createQueueEntrySchema),
  });

  const { errors } = formState;

  useEffect(() => {
    setPriorityComment(priorityLabels[contentSwitcherIndex]);
  }, [contentSwitcherIndex, priorityLabels]);

  useEffect(() => {
    setStatus(statusLabels[statusSwitcherIndex].status);
  }, [statusSwitcherIndex, statusLabels]);

  const filteredlocations = queueRoomLocations?.filter((location) => location?.uuid != null);

  const filteredProviders = providers?.flatMap((provider) =>
    provider.attributes.filter(
      (item) =>
        item.attributeType.display === 'Default Location' &&
        typeof item.value === 'object' &&
        item?.value?.uuid === selectedNextQueueLocation,
    ).length > 0
      ? provider
      : [],
  );
  // endVisit
  const endCurrentVisit = async () => {
    try {
      const endVisitPayload = {
        location: activeVisit.location.uuid,
        startDatetime: parseDate(activeVisit.startDatetime),
        visitType: activeVisit.visitType.uuid,
        stopDatetime: new Date(),
      };

      const response = await updateVisit(activeVisit.uuid, endVisitPayload);

      if (response.status === 200) {
        const comment = event?.target['nextNotes']?.value ?? 'Not Set';

        try {
          await updateQueueEntry(
            QueueStatus.Completed,
            provider,
            queueEntry?.id,
            contentSwitcherIndex,
            priorityComment,
            comment,
          );

          showSnackbar({
            isLowContrast: true,
            kind: 'success',
            subtitle: t('visitEndSuccessfully', `${response?.data?.visitType?.display} ended successfully`),
            title: t('visitEnded', 'Visit ended'),
          });

          navigate({ to: `\${openmrsSpaBase}/home` });
          closeModal();
          mutate();
        } catch (error) {
          showNotification({
            title: t('queueEntryUpdateFailed', 'Error ending visit'),
            kind: 'error',
            critical: true,
            description: error?.message,
          });
        }
      }
    } catch (error) {
      showSnackbar({
        title: t('errorEndingVisit', 'Error ending visit'),
        kind: 'error',
        isLowContrast: false,
        subtitle: error?.message,
      });
    }
  };

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        if (status === QueueStatus.Pending) {
          const comment = event?.target['nextNotes']?.value ?? 'Not Set';

          await updateQueueEntry(status, provider, queueEntry?.id, 0, priorityComment, comment);

          showToast({
            critical: true,
            title: t('updateEntry', 'Update entry'),
            kind: 'success',
            description: t('queueEntryUpdateSuccessfully', 'Queue Entry Updated Successfully'),
          });

          closeModal();
          mutate();
        } else if (status === QueueStatus.Completed) {
          const comment = event?.target['nextNotes']?.value ?? 'Not Set';
          const nextQueueLocationUuid = event?.target['nextQueueLocation']?.value;

          await updateQueueEntry(
            QueueStatus.Completed,
            provider,
            queueEntry?.id,
            contentSwitcherIndex,
            priorityComment,
            comment,
          );

          showToast({
            critical: true,
            title: t('updateEntry', 'Update entry'),
            kind: 'success',
            description: t('queueEntryUpdateSuccessfully', 'Queue Entry Updated Successfully'),
          });

          mutate();

          await addQueueEntry(
            nextQueueLocationUuid,
            queueEntry?.patientUuid,
            selectedProvider,
            contentSwitcherIndex,
            QueueStatus.Pending,
            sessionUser?.sessionLocation?.uuid,
            priorityComment,
            comment,
          );

          showToast({
            critical: true,
            title: t('addQueueEntry', 'Add Queue Entry'),
            kind: 'success',
            description: t('queueEntryAddedSuccessfully', 'Queue Entry Added Successfully'),
          });

          mutate();

          // Pick and route
          await updateQueueEntry(
            QueueStatus.Picked,
            provider,
            currentEntry?.id,
            contentSwitcherIndex,
            priorityComment,
            comment,
          );

          showToast({
            critical: true,
            title: t('updateEntry', 'Move to next queue'),
            kind: 'success',
            description: t('movetonextqueue', 'Move to next queue successfully'),
          });

          // View patient summary
          navigate({ to: `\${openmrsSpaBase}/patient/${currentEntry.patientUuid}/chart` });

          closeModal();
          mutate();
        }
      } catch (error: any) {
        showNotification({
          title: t('queueEntryUpdateFailed', 'Error updating queue entry status'),
          kind: 'error',
          critical: true,
          description: error?.message,
        });
      }
    },
    [
      status,
      provider,
      queueEntry?.id,
      queueEntry?.patientUuid,
      priorityComment,
      t,
      closeModal,
      mutate,
      contentSwitcherIndex,
      selectedProvider,
      sessionUser?.sessionLocation?.uuid,
      currentEntry?.id,
      currentEntry.patientUuid,
    ],
  );

  if (queueEntry && Object.keys(queueEntry)?.length === 0) {
    return <ModalHeader closeModal={closeModal} title={t('patientNotInQueue', 'The patient is not in the queue')} />;
  }

  if (queueEntry && Object.keys(queueEntry)?.length > 0) {
    return (
      <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader closeModal={closeModal} />
          <ModalBody>
            <div className={styles.modalBody}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h4 className={styles.section}> Currently Picked :</h4>
                <div style={{ margin: '10px' }}>
                  <ArrowDown size={20} />
                </div>
              </div>
              {currentEntry?.name ? (
                <h5 className={styles.section}>
                  {currentEntry?.name} &nbsp; · &nbsp;{currentEntry?.patientSex} &nbsp; · &nbsp;
                  {currentEntry?.patientAge}
                  &nbsp;
                  {t('years', 'Years')}
                </h5>
              ) : (
                '--'
              )}

              <br></br>
              <hr />
              <br></br>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h4 className={styles.section}> Queue to next service area :</h4>
                <div style={{ margin: '10px' }}>
                  <ArrowUp size={20} />
                </div>
              </div>
              {queueEntry?.name ? (
                <h5 className={styles.section}>
                  {queueEntry?.name} &nbsp; · &nbsp;{queueEntry?.patientSex} &nbsp; · &nbsp;{queueEntry?.patientAge}
                  &nbsp;
                  {t('years', 'Years')}
                </h5>
              ) : (
                '--'
              )}
            </div>
            <section className={styles.section}>
              <div className={styles.sectionTitle}>{t('priority', 'Priority')}</div>
              <Controller
                name="priorityComment"
                control={control}
                render={({ field }) => (
                  <ContentSwitcher
                    {...field}
                    selectedIndex={contentSwitcherIndex}
                    className={styles.contentSwitcher}
                    onChange={({ index }) => {
                      field.onChange(index);
                      setContentSwitcherIndex(index);
                    }}
                  >
                    {priorityLabels.map((label, index) => (
                      <Switch
                        key={index}
                        name={label.toLowerCase().replace(/\s+/g, '')}
                        text={t(label.toLowerCase(), label)}
                      />
                    ))}
                  </ContentSwitcher>
                )}
              />
            </section>

            <section className={styles.section}>
              <div className={styles.sectionTitle}>{t('status', 'Status')}</div>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <ContentSwitcher
                    {...field}
                    selectedIndex={statusSwitcherIndex}
                    className={styles.contentSwitcher}
                    onChange={({ index }) => {
                      field.onChange(index);
                      setStatusSwitcherIndex(index);
                    }}
                  >
                    {statusLabels.map((status, index) => (
                      <Switch
                        key={index}
                        name={status.label.toLowerCase().replace(' ', '')}
                        text={t(status.label.toLowerCase(), status.label)}
                      />
                    ))}
                  </ContentSwitcher>
                )}
              />
            </section>

            {status === QueueStatus.Completed && (
              <>
                <section className={styles.section}>
                  <div className={styles.sectionTitle}>{t('nextServicePoint', 'Next service point')}</div>
                  <ResponsiveWrapper isTablet={isTablet}>
                    <Controller
                      name="locationTo"
                      control={control}
                      defaultValue={filteredlocations.length > 0 ? filteredlocations[0].uuid : ''}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelText={''}
                          id="nextQueueLocation"
                          name="nextQueueLocation"
                          disabled={errorLoadingQueueRooms}
                          invalid={!!errors.locationTo}
                          invalidText={errors.locationTo?.message}
                          value={field.value}
                          onChange={(event) => {
                            field.onChange(event.target.value);
                            setSelectedNextQueueLocation(event.target.value);
                          }}
                        >
                          {!field.value ? (
                            <SelectItem text={t('selectNextServicePoint', 'Choose next service point')} value="" />
                          ) : null}
                          {filteredlocations.map((location) => (
                            <SelectItem key={location.uuid} text={location.display} value={location.uuid}>
                              {location.display}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />

                    {errorLoadingQueueRooms && (
                      <InlineNotification
                        className={styles.errorNotification}
                        kind="error"
                        onClick={() => {}}
                        subtitle={errorLoadingQueueRooms}
                        title={t('errorFetchingQueueRooms', 'Error fetching queue rooms')}
                      />
                    )}
                  </ResponsiveWrapper>
                </section>
                <section className={styles.section}>
                  <div className={styles.sectionTitle}>{t('selectAProvider', 'Select a provider')}</div>
                  <ResponsiveWrapper isTablet={isTablet}>
                    <Controller
                      name="provider"
                      control={control}
                      defaultValue={filteredProviders.length > 0 ? filteredProviders[0].uuid : ''}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelText={''}
                          id="providers-list"
                          name="providers-list"
                          disabled={errorLoadingProviders}
                          invalid={!!errors.provider}
                          invalidText={errors.provider?.message}
                          value={field.value}
                          onChange={(event) => {
                            field.onChange(event.target.value);
                            setSelectedProvider(event.target.value);
                          }}
                        >
                          {!field.value ? (
                            <SelectItem text={t('selectProvider', 'choose a provider')} value="" />
                          ) : null}
                          {filteredProviders.map((provider) => (
                            <SelectItem key={provider.uuid} text={provider.display} value={provider.uuid}>
                              {provider.display}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />

                    {errorLoadingProviders && (
                      <InlineNotification
                        className={styles.errorNotification}
                        kind="error"
                        onClick={() => {}}
                        subtitle={errorLoadingProviders}
                        title={t('errorFetchingQueueRooms', 'Error fetching providers')}
                      />
                    )}
                  </ResponsiveWrapper>
                </section>
                <section className={styles.section}>
                  <div className={styles.sectionTitle}>{t('notes', 'Notes')}</div>
                  <ResponsiveWrapper isTablet={isTablet}>
                    <Controller
                      name="comment"
                      control={control}
                      defaultValue="NA"
                      render={({ field }) => (
                        <TextArea
                          {...field}
                          aria-label={t('comment', 'Comment')}
                          invalid={!!errors.comment}
                          invalidText={errors.comment?.message}
                          labelText=""
                          id="comment"
                          name="comment"
                          maxCount={500}
                          enableCounter
                        />
                      )}
                    />
                  </ResponsiveWrapper>
                </section>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={closeModal}>
              {t('cancel', 'Cancel')}
            </Button>
            <Button kind="danger" onClick={endCurrentVisit}>
              {t('endVisit', 'End Visit')}
            </Button>
            {isLoading ? (
              <InlineLoading description={'Fetching Provider..'} />
            ) : (
              <Button type="submit">{status === 'pending' ? 'Save' : 'Move to the next queue room'}</Button>
            )}
          </ModalFooter>
        </Form>
      </div>
    );
  }
};

function ResponsiveWrapper({ children, isTablet }) {
  return isTablet ? <Layer>{children}</Layer> : <div>{children}</div>;
}

export default ChangeStatus;
