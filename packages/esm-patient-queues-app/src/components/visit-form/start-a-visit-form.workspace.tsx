import {
  Button,
  ButtonSet,
  ContentSwitcher,
  Dropdown,
  Layer,
  Select,
  SelectItem,
  Switch,
  TextArea,
  InlineLoading,
  InlineNotification,
} from '@carbon/react';
import {
  DefaultWorkspaceProps,
  ExtensionSlot,
  restBaseUrl,
  showNotification,
  showSnackbar,
  useLayoutType,
  usePatient,
  useSession,
  useVisitTypes,
} from '@openmrs/esm-framework';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './start-a-visit-form.scss';
import { useQueueRoomLocations } from '../../hooks/useQueueRooms';
import {
  NewCheckInPayload,
  checkCurrentVisit,
  checkInQueue,
  useProviders,
} from '../../active-visits/patient-queues.resource';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateQueueEntryFormData,
  createQueueEntrySchema,
} from '../../active-visits/patient-queue-validation-schema.resource';
import { QueueStatus, handleMutate } from '../../utils/utils';

type VisitFormProps = DefaultWorkspaceProps & {
  patientUuid: string;
};

const StartVisitForm: React.FC<VisitFormProps> = ({ closeWorkspace, patientUuid }) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const sessionUser = useSession();
  const [contentSwitcherIndex, setContentSwitcherIndex] = useState(0);
  const { patient } = usePatient(patientUuid);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const allVisitTypes = useVisitTypes();
  const [visitType, setVisitType] = useState('');
  const [priorityComment, setPriorityComment] = useState('');
  const [visitComment, setVisitComment] = useState('');
  const priorityLevels = [1, 2, 3];
  const { queueRoomLocations, error: errorLoadingQueueRooms } = useQueueRoomLocations(
    sessionUser?.sessionLocation?.uuid,
  );
  const [selectedNextQueueLocation, setSelectedNextQueueLocation] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const priorityLabels = useMemo(() => ['Not Urgent', 'Urgent', 'Emergency'], []);

  const { providers, error: errorLoadingProviders } = useProviders(selectedNextQueueLocation);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateQueueEntryFormData>({
    mode: 'all',
    resolver: zodResolver(createQueueEntrySchema),
    defaultValues: {
      status: QueueStatus.Pending,
      priorityComment: priorityLabels[contentSwitcherIndex],
    },
  });

  useEffect(() => {
    setPriorityComment(priorityLabels[contentSwitcherIndex]);
  }, [contentSwitcherIndex, priorityLabels]);

  useEffect(() => {
    if (queueRoomLocations?.length && sessionUser) {
      setVisitType(allVisitTypes?.length > 0 ? allVisitTypes[0].uuid : null);
    }
  }, [sessionUser, queueRoomLocations?.length, queueRoomLocations, allVisitTypes]);

  const onSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Check for an existing visit before proceeding
      const existingVisit = await checkCurrentVisit(patientUuid);

      if (existingVisit) {
        showNotification({
          title: t('visitExists', 'Visit already exists'),
          kind: 'info',
          description: t('activeVisitExists', 'An active visit already exists for this patient.'),
        });
        return;
      }
      // Add new queue entry
      const request: NewCheckInPayload = {
        patient: patientUuid,
        provider: selectedProvider,
        currentLocation: sessionUser?.sessionLocation?.uuid,
        locationTo: selectedNextQueueLocation,
        patientStatus: QueueStatus.Pending,
        priority: contentSwitcherIndex,
        priorityComment: priorityComment,
        visitComment: visitComment,
        queueRoom: selectedNextQueueLocation,
        visitType: visitType,
      };

      const createQueueResponse = await checkInQueue(request);

      if (createQueueResponse.status === 201) {
        showSnackbar({
          kind: 'success',
          title: t('startVisit', 'Start a visit'),
          subtitle: t('startVisitQueueSuccessfully', 'Patient has been added to active visits list and queue.'),
        });

        handleMutate(`${restBaseUrl}/patientqueue`);
        handleMutate(`${restBaseUrl}/queuestatistics`);
        closeWorkspace();
      }
    } catch (error) {
      closeWorkspace();
      showNotification({
        title: t('startVisitError', 'Error starting visit'),
        kind: 'error',
        critical: true,
        description: error?.message || t('unexpectedError', 'An unexpected error occurred'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    closeWorkspace,
    contentSwitcherIndex,
    patientUuid,
    priorityComment,
    selectedNextQueueLocation,
    selectedProvider,
    t,
    visitType,
    sessionUser?.sessionLocation?.uuid,
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        {patient && (
          <ExtensionSlot
            name="patient-header-slot"
            state={{
              patient,
              patientUuid: patientUuid,
              hideActionsOverflow: true,
            }}
          />
        )}
        {Object.keys(errors).length > 0 && (
          <div className={styles.errorMessage}>
            <ul>
              {Object.entries(errors).map(([key, error]) => (
                <li key={key}>
                  {key}: {error?.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        <section className={styles.section}>
          <div className={styles.sectionTitle}>{t('priority', 'Priority')}</div>

          <Controller
            name="priorityComment"
            control={control}
            render={({ field }) => (
              <>
                <ContentSwitcher
                  {...field}
                  selectedIndex={contentSwitcherIndex}
                  className={styles.contentSwitcher}
                  onChange={({ index }) => {
                    field.onChange(priorityLabels[index]);
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

                {errors.priorityComment && <div className={styles.error}>{errors.priorityComment.message}</div>}
              </>
            )}
          />
        </section>

        <section className={styles.section}>
          {contentSwitcherIndex !== 0 && (
            <>
              <div className={styles.sectionTitle}>{t('priorityLevel', 'Priority Levels')}</div>

              <ResponsiveWrapper isTablet={isTablet}>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      aria-label={t('prioritylevels', 'Priority Levels')}
                      id="priority-levels"
                      titleText=""
                      label="Choose a priority level"
                      items={priorityLevels ?? []}
                      initialSelectedItem={priorityLevels[0]}
                      itemToString={(item) => (item ? String(item.name || item.label || item) : '')}
                      onChange={({ selectedItem }) => {
                        if (!selectedItem) return;
                        field.onChange(selectedItem.id);
                      }}
                      invalid={!!errors.priority}
                      invalidText={errors.priority?.message}
                    />
                  )}
                />
              </ResponsiveWrapper>
            </>
          )}
        </section>

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
                  {!field.value ? <SelectItem text={t('selectProvider', 'choose a provider')} value="" /> : null}
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
          <div className={styles.sectionTitle}>{t('visitNotes', 'Visit Notes')}</div>
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
                  onChange={(event) => {
                    field.onChange(event.target.value);
                    setVisitComment(event.target.value);
                  }}
                />
              )}
            />
          </ResponsiveWrapper>
        </section>
      </div>
      <ButtonSet className={styles.buttonSet}>
        <Button className={styles.button} kind="secondary" onClick={closeWorkspace}>
          {t('discard', 'Discard')}
        </Button>
        <Button
          className={styles.button}
          disabled={isSubmitting}
          kind="primary"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <InlineLoading description={t('saving', 'Saving') + '...'} />
          ) : (
            <span>{t('startVisit', 'Start visit')}</span>
          )}
        </Button>
      </ButtonSet>
    </div>
  );
};

function ResponsiveWrapper({ children, isTablet }) {
  return isTablet ? <Layer>{children}</Layer> : <div>{children}</div>;
}

export default StartVisitForm;
