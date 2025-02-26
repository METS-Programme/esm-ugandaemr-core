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
  restBaseUrl,
  showNotification,
  showSnackbar,
  showToast,
  useLayoutType,
  useSession,
  useVisit,
} from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { useQueueRoomLocations } from '../hooks/useQueueRooms';
import { ArrowUp, ArrowDown } from '@carbon/react/icons';
import styles from './change-status-dialog.scss';
import { QueueStatus, extractErrorMessagesFromResponse, handleMutate } from '../utils/utils';
import {
  NewQueuePayload,
  addQueueEntry,
  getCareProvider,
  updateQueueEntry,
  updateVisit,
  useProviders,
} from './patient-queues.resource';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateQueueEntryFormData, createQueueEntrySchema } from './patient-queue-validation-schema.resource';
import { PatientQueue } from '../types/patient-queues';

interface ChangeStatusDialogProps {
  queueEntry: PatientQueue;
  currentEntry: PatientQueue;
  closeModal: () => void;
}

const ChangeStatus: React.FC<ChangeStatusDialogProps> = ({ queueEntry, currentEntry, closeModal }) => {
  const { t } = useTranslation();

  const isTablet = useLayoutType() === 'tablet';

  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(1);

  const [statusSwitcherIndex, setStatusSwitcherIndex] = useState(1);

  const [status, setStatus] = useState('');

  const sessionUser = useSession();

  const { queueRoomLocations, error: errorLoadingQueueRooms } = useQueueRoomLocations(
    sessionUser?.sessionLocation?.uuid,
  );

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);

  const [provider, setProvider] = useState('');

  const [priorityComment, setPriorityComment] = useState('');

  const [selectedProvider, setSelectedProvider] = useState('');

  const { activeVisit } = useVisit(queueEntry.patient.uuid);

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { providers, error: errorLoadingProviders } = useProviders(selectedNextQueueLocation);

  // Memoize the function to fetch the provider using useCallback
  const fetchProvider = useCallback(() => {
    if (!sessionUser?.user?.uuid) return;

    setIsLoading(true);

    getCareProvider(sessionUser?.user?.uuid).then(
      (response) => {
        const uuid = response?.data?.results[0].uuid;
        setIsLoading(false);
        setProvider(uuid);
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
  }, [sessionUser?.user?.uuid]);

  useEffect(() => fetchProvider(), [fetchProvider]);

  const priorityLabels = useMemo(() => ['Not Urgent', 'Urgent', 'Emergency'], []);

  const statusLabels = useMemo(
    () => [
      { status: 'pending', label: 'Move to Pending' },
      { status: 'completed', label: 'Move to Completed' },
    ],
    [],
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQueueEntryFormData>({
    mode: 'all',
    resolver: zodResolver(createQueueEntrySchema),
  });

  useEffect(() => {
    setPriorityComment(priorityLabels[contentSwitcherIndex]);
  }, [contentSwitcherIndex, priorityLabels]);

  useEffect(() => {
    setStatus(statusLabels[statusSwitcherIndex].status);
  }, [statusSwitcherIndex, statusLabels]);

  // endVisit
  const endCurrentVisit = async () => {
    const endVisitPayload = {
      location: activeVisit.location.uuid,
      startDatetime: parseDate(activeVisit.startDatetime),
      visitType: activeVisit.visitType.uuid,
      stopDatetime: new Date(),
    };

    const response = await updateVisit(activeVisit.uuid, endVisitPayload);

    if (response.status === 200) {
      try {
        const response = await updateQueueEntry(
          QueueStatus.Completed,
          provider,
          queueEntry?.uuid,
          contentSwitcherIndex,
          priorityComment,
          'comment',
        );

        if (response.status === 200) {
          showSnackbar({
            isLowContrast: true,
            kind: 'success',
            subtitle: t('visitEndSuccessfully', 'Visit ended successfully'),
            title: t('visitEnded', 'Visit ended'),
          });

          navigate({ to: `\${openmrsSpaBase}/home` });
          closeModal();
        }
      } catch (error) {
        showNotification({
          title: t('queueEntryUpdateFailed', 'Error ending visit'),
          kind: 'error',
          critical: true,
          description: error?.message,
        });
      }
    }
  };

  const onSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      if (status === QueueStatus.Pending) {
        await updateQueueEntry(status, provider, queueEntry?.uuid, 0, priorityComment, 'comment');

        showToast({
          critical: true,
          title: t('updateEntry', 'Update entry'),
          kind: 'success',
          description: t('queueEntryUpdateSuccessfully', 'Queue Entry Updated Successfully'),
        });

        closeModal();
        handleMutate(`${restBaseUrl}/patientqueue`);
        setIsSubmitting(false);
      }
      if (status === QueueStatus.Completed) {
        await updateQueueEntry(
          QueueStatus.Completed,
          provider,
          queueEntry?.uuid,
          contentSwitcherIndex,
          priorityComment,
          'comment',
        );

        // Add new queue entry
        const request: NewQueuePayload = {
          patient: queueEntry?.patient?.uuid,
          provider: selectedProvider,
          locationFrom: sessionUser?.sessionLocation?.uuid,
          locationTo: selectedNextQueueLocation,
          status: QueueStatus.Pending,
          priority: contentSwitcherIndex,
          priorityComment: priorityComment,
          comment: 'NA',
          queueRoom: selectedNextQueueLocation,
        };

        const createQueueResponse = await addQueueEntry(request);

        if (createQueueResponse.status === 201) {
          // Pick and route
          await updateQueueEntry(
            QueueStatus.Picked,
            provider,
            currentEntry?.uuid,
            contentSwitcherIndex,
            priorityComment,
            'comment',
          );

          showToast({
            critical: true,
            title: t('updateEntry', 'Move to next queue'),
            kind: 'success',
            description: t('movetonextqueue', 'Move to next queue successfully'),
          });

          // View patient summary
          navigate({ to: `\${openmrsSpaBase}/patient/${currentEntry?.patient?.uuid}/chart` });

          closeModal();
          handleMutate(`${restBaseUrl}/patientqueue`);
          setIsSubmitting(false);
        }
      }
    } catch (error: any) {
      setIsSubmitting(false);
      showNotification({
        title: t('queueEntryUpdateFailed', 'Error updating queue entry status'),
        kind: 'error',
        critical: true,
        description: error?.message,
      });
    }
  }, [
    status,
    provider,
    queueEntry?.uuid,
    queueEntry?.patient?.uuid,
    priorityComment,
    t,
    closeModal,
    contentSwitcherIndex,
    selectedProvider,
    sessionUser?.sessionLocation?.uuid,
    currentEntry?.uuid,
    currentEntry?.patient?.uuid,
    selectedNextQueueLocation,
  ]);

  if (queueEntry && Object.keys(queueEntry)?.length === 0) {
    return <ModalHeader closeModal={closeModal} title={t('patientNotInQueue', 'The patient is not in the queue')} />;
  }

  if (queueEntry && Object.keys(queueEntry)?.length > 0) {
    return (
      <div>
        {isLoading && <InlineLoading description={'Fetching Provider..'} />}
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
              {currentEntry?.patient?.display ? (
                <h5 className={styles.section}>
                  {currentEntry?.patient?.display} &nbsp; · &nbsp;{currentEntry?.patient?.person?.gender} &nbsp; ·
                  &nbsp;
                  {currentEntry?.patient?.person?.age}
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
              {queueEntry?.patient?.display ? (
                <h5 className={styles.section}>
                  {queueEntry?.patient?.display} &nbsp; · &nbsp;{queueEntry?.patient?.person?.gender} &nbsp; · &nbsp;
                  {queueEntry?.patient?.person?.age}
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
                      defaultValue={queueRoomLocations.length > 0 ? queueRoomLocations[0].uuid : ''}
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
                          {queueRoomLocations.map((location) => (
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
                      defaultValue={providers.length > 0 ? providers[0].uuid : ''}
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
                          {providers.map((provider) => (
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
                          value={field.value}
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
            {isSubmitting ? (
              <InlineLoading description={'Submitting...'} />
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
