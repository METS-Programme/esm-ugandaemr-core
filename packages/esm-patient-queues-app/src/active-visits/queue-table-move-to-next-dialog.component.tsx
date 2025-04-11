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
  TextArea,
  InlineLoading,
  Layer,
  InlineNotification,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import {
  getSessionStore,
  navigate,
  restBaseUrl,
  showNotification,
  showToast,
  useLayoutType,
  useSession,
} from '@openmrs/esm-framework';
import { useQueueRoomLocations } from '../hooks/useQueueRooms';
import styles from './change-status-dialog.scss';
import { QueueStatus, extractErrorMessagesFromResponse, handleMutate } from '../utils/utils';
import { PatientQueue } from '../types/patient-queues';
import {
  NewQueuePayload,
  addQueueEntry,
  getCareProvider,
  getCurrentPatientQueueByPatientUuid,
  updateQueueEntry,
  useProviders,
} from './patient-queues.resource';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import { CreateQueueEntryFormData, createQueueEntrySchema } from './patient-queue-validation-schema.resource';

interface ChangeStatusDialogProps {
  patientUuid: string;
  entries: PatientQueue[];
  closeModal: () => void;
}

const QueueTableMoveToNext: React.FC<ChangeStatusDialogProps> = ({ patientUuid, entries, closeModal }) => {
  const { t } = useTranslation();

  const sessionUser = useSession();

  const isTablet = useLayoutType() === 'tablet';

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(1);

  const [statusSwitcherIndex, setStatusSwitcherIndex] = useState(1);

  const [status, setStatus] = useState('');

  const { queueRoomLocations, error: errorLoadingQueueRooms } = useQueueRoomLocations(
    sessionUser?.sessionLocation?.uuid,
  );

  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState(queueRoomLocations[0]?.uuid);


  const [priorityComment, setPriorityComment] = useState('');

  const { providers, error: errorLoadingProviders } = useProviders(selectedNextQueueLocation);

  const {
    setValue,
    watch,
  } = useFormContext();

  const selectedProvider = watch('provider');
  const [isFetchingProvider, setIsFetchingProvider] = useState(false);

  const fetchAndSetDefaultProvider = useCallback(async () => {
    if (!sessionUser?.user?.uuid) return;

    try {
      setIsFetchingProvider(true);
      const response = await getCareProvider(sessionUser.user.uuid);
      const fetchedProvider = response?.data?.results?.[0]?.uuid;

      if (fetchedProvider) {
        const providerExists = providers.some(({ uuid }) => uuid === fetchedProvider);
        if (providerExists) {
          setValue('provider', fetchedProvider);
        }
      } else {
        showNotification({
          title: "Provider Not Found",
          kind: "error",
          critical: true,
          description: "No care provider linked to your account.",
        });
      }
    } catch (error) {
      showNotification({
        title: "Couldn't fetch provider",
        kind: "error",
        critical: true,
        description: extractErrorMessagesFromResponse(error).join(', '),
      });
    } finally {
      setIsFetchingProvider(false);
    }
  }, [sessionUser?.user?.uuid, providers, setValue]);

  useEffect(() => {
    fetchAndSetDefaultProvider();
  }, [fetchAndSetDefaultProvider]);

  // Reset provider if location changes
  useEffect(() => {
    setValue('provider', '');
  }, [selectedNextQueueLocation, setValue]);

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

  // change to picked
  const onSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const patientQueueEntryResponse = await getCurrentPatientQueueByPatientUuid(
        patientUuid,
        sessionUser?.sessionLocation?.uuid,
      );

      const queues = patientQueueEntryResponse.data?.results[0]?.patientQueues;
      const queueEntry = queues?.filter((item) => item?.patient?.uuid === patientUuid);

      if (status === QueueStatus.Pending) {
        if (queueEntry.length > 0) {
          await updateQueueEntry(status, selectedProvider, queueEntry[0]?.uuid, 0, priorityComment, 'NA').then(() => {
            showToast({
              critical: true,
              title: t('moveToNextServicePoint', 'Move back your service point'),
              kind: 'success',
              description: t('backToQueue', 'Successfully moved back patient to your service point'),
            });
            closeModal();
            handleMutate(`${restBaseUrl}/patientqueue`);
            setIsSubmitting(false);
          });
        }
      }

      if (status === QueueStatus.Completed) {
        if (queueEntry.length > 0) {
          await updateQueueEntry(
            QueueStatus.Completed,
            selectedProvider,
            queueEntry[0]?.uuid,
            contentSwitcherIndex,
            priorityComment,
            'NA',
          );

          const request: NewQueuePayload = {
            patient: patientUuid,
            provider: selectedProvider,
            locationFrom: sessionUser?.sessionLocation?.uuid,
            locationTo: selectedNextQueueLocation,
            status: status ?? QueueStatus.Pending,
            priority: contentSwitcherIndex,
            priorityComment: priorityComment,
            comment: 'NA',
            queueRoom: selectedNextQueueLocation,
          };

          const createQueueResponse = await addQueueEntry(request);

          if (createQueueResponse.status === 201) {
            const response = await updateQueueEntry(
              QueueStatus.Pending,
              selectedProvider,
              createQueueResponse.data?.uuid,
              contentSwitcherIndex,
              priorityComment,
              'NA',
            );

            if (response.status === 200) {
              showToast({
                critical: true,
                title: t('moveToNextServicePoint', 'Move to next service point'),
                kind: 'success',
                description: t('movetonextservicepoint', 'Moved to next service point successfully'),
              });
              handleMutate(`${restBaseUrl}/patientqueue`);
              closeModal();
              setIsSubmitting(false);
              // view patient summary
              // navigate({ to: `\${openmrsSpaBase}/home` });
              const roles = getSessionStore().getState().session?.user?.roles;
              const roleName = roles[0]?.display;
              if (roles && roles?.length > 0) {
                if (roles?.filter((item) => item?.display === 'Organizational: Clinician').length > 0) {
                  navigate({
                    to: `${window.getOpenmrsSpaBase()}home/clinical-room-patient-queues`,
                  });
                } else if (roleName === 'Triage') {
                  navigate({
                    to: `${window.getOpenmrsSpaBase()}home/triage-patient-queues`,
                  });
                } else {
                  navigate({ to: `${window.getOpenmrsSpaBase()}home` });
                }
              }
            }
          }
        }
      }
    } catch (error) {
      setIsSubmitting(false);
      const errorMessages = extractErrorMessagesFromResponse(error);
      showNotification({
        title: t('moveToNextServicePoint', 'Error moving to next service point'),
        kind: 'error',
        critical: true,
        description: errorMessages.join(','),
      });
    }
  }, [
    closeModal,
    contentSwitcherIndex,
    patientUuid,
    priorityComment,
    selectedProvider,
    selectedNextQueueLocation,
    selectedProvider,
    sessionUser?.sessionLocation?.uuid,
    status,
    t,
  ]);

  return (
    <div>
      {isLoading && <InlineLoading description={'Fetching Provider..'} />}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader closeModal={closeModal} />
        <ModalBody>
          <div className={styles.modalBody}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h4 className={styles.section}> Queue to next service area</h4>
            </div>
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
                    defaultValue={queueRoomLocations[0]?.uuid || ''}
                    render={({ field }) => (
                      <Select
                        {...field}
                        id="nextQueueLocation"
                        name="nextQueueLocation"
                        labelText=""
                        disabled={errorLoadingQueueRooms}
                        invalid={!!errors.locationTo}
                        invalidText={errors.locationTo?.message}
                        value={field.value}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          field.onChange(selectedValue);
                          setSelectedNextQueueLocation(selectedValue);
                        }}
                      >
                        {!field.value && (
                          <SelectItem value="" text={t('selectNextServicePoint', 'Choose next service point')} />
                        )}

                        {queueRoomLocations.map(({ uuid, display }) => (
                          <SelectItem key={uuid} value={uuid} text={display} />
                        ))}
                      </Select>
                    )}
                  />

                  {errorLoadingQueueRooms && (
                    <InlineNotification
                      className={styles.errorNotification}
                      kind="error"
                      title={t('errorFetchingQueueRooms', 'Error fetching queue rooms')}
                      subtitle={errorLoadingQueueRooms}
                      onCloseButtonClick={() => { }}
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
                    defaultValue=""
                    render={({ field }) => (
                      <Select
                        {...field}
                        id="providers-list"
                        name="providers-list"
                        disabled={errorLoadingProviders || isFetchingProvider}
                        invalid={!!errors.provider}
                        invalidText={errors.provider?.message}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      >
                        {!field.value && (
                          <SelectItem value="" text={t('selectProvider', 'Choose a provider')} />
                        )}

                        {providers.map(({ uuid, display }) => (
                          <SelectItem key={uuid} value={uuid} text={display} />
                        ))}
                      </Select>
                    )}
                  />

                  {errorLoadingProviders && (
                    <InlineNotification
                      className={styles.errorNotification}
                      kind="error"
                      title={t('errorFetchingQueueRooms', 'Error fetching providers')}
                      subtitle={errorLoadingProviders}
                      onClick={() => { }}
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
          {isSubmitting ? (
            <InlineLoading description={'Submitting...'} />
          ) : (
            <Button disabled={!selectedProvider || isFetchingProvider || isSubmitting}
              type="submit">{status === QueueStatus.Pending ? 'Save' : 'Move to the next queue room'}</Button>
          )}
        </ModalFooter>
      </Form>
    </div>
  );
};

function ResponsiveWrapper({ children, isTablet }) {
  return isTablet ? <Layer>{children}</Layer> : <div>{children}</div>;
}

export default QueueTableMoveToNext;
