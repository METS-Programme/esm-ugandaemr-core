import React, { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import {
  Button,
  ButtonSet,
  DatePicker,
  DatePickerInput,
  Form,
  Stack,
  RadioButtonGroup,
  RadioButton,
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import {
  useSession,
  useLayoutType,
  toOmrsIsoString,
  toDateObjectStrict,
  showNotification,
  useConfig,
  restBaseUrl,
  showSnackbar,
} from '@openmrs/esm-framework';
import styles from './standard-regimen.scss';
import StandardRegimen from './standard-regimen.component';
import RegimenReason from './regimen-reason.component';
import { Encounter, Regimen, UpdateObs } from '../types';
import { saveEncounter, updateEncounter } from './regimen.resource';
import { useRegimenEncounter } from '../hooks/useRegimenEncounter';
import { CarePanelConfig } from '../config-schema';
import { mutate } from 'swr';
import NonStandardRegimen from './non-standard-regimen.component';
import { addOrUpdateObsObject } from './utils';

interface RegimenFormProps {
  patientUuid: string;
  category: string;
  onRegimen: string;
  lastRegimenEncounter: {
    uuid: string;
    startDate: string;
    endDate: string;
    event: string;
  };
  closeWorkspace: () => void;
}

const RegimenForm: React.FC<RegimenFormProps> = ({
  patientUuid,
  category,
  onRegimen,
  lastRegimenEncounter,
  closeWorkspace,
}) => {
  const { t } = useTranslation();
  const isTablet = useLayoutType() === 'tablet';
  const sessionUser = useSession();
  const config = useConfig() as CarePanelConfig;
  const { regimenEncounter, isLoading, error } = useRegimenEncounter(category, patientUuid);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitDate, setVisitDate] = useState(new Date());
  const [regimenEvent, setRegimenEvent] = useState('');
  const [standardRegimen, setStandardRegimen] = useState('');
  const [standardRegimenLine, setStandardRegimenLine] = useState('');
  const [nonStandardRegimens, setNonStandardRegimens] = useState([]);
  const [regimenReason, setRegimenReason] = useState('');
  const [selectedRegimenType, setSelectedRegimenType] = useState('');
  const [obsArray, setObsArray] = useState([]);
  const [obsArrayForPrevEncounter, setObsArrayForPrevEncounter] = useState([]);

  useEffect(() => {
    if (standardRegimenLine && regimenEvent !== Regimen.stopRegimenConcept) {
      const regimenLineObs = {
        concept: Regimen.RegimenLineConcept,
        value: standardRegimenLine,
      };
      addOrUpdateObsObject(regimenLineObs, obsArray, setObsArray);
    }

    if (standardRegimen && regimenEvent !== Regimen.stopRegimenConcept) {
      const standardRegimenObs = {
        concept: Regimen.standardRegimenConcept,
        value: standardRegimen,
      };
      addOrUpdateObsObject(standardRegimenObs, obsArray, setObsArray);
    }

    if (
      regimenReason &&
      (regimenEvent === Regimen.stopRegimenConcept || regimenEvent === Regimen.changeRegimenConcept)
    ) {
      const regimenReasonObs = {
        concept: Regimen.reasonCodedConcept,
        value: regimenReason,
      };
      addOrUpdateObsObject(regimenReasonObs, obsArrayForPrevEncounter, setObsArrayForPrevEncounter);
    }
    if (visitDate && (regimenEvent === Regimen.stopRegimenConcept || regimenEvent === Regimen.changeRegimenConcept)) {
      const dateStoppedRegObs = {
        concept: Regimen.dateDrugStoppedCon,
        value: toDateObjectStrict(
          toOmrsIsoString(new Date(dayjs(visitDate).year(), dayjs(visitDate).month(), dayjs(visitDate).date())),
        ),
      };
      addOrUpdateObsObject(dateStoppedRegObs, obsArrayForPrevEncounter, setObsArrayForPrevEncounter);
    }
    if (regimenEvent && category === 'ARV') {
      const categoryObs = {
        concept: Regimen.arvCategoryConcept,
        value: regimenEvent,
      };
      if (regimenEvent === Regimen.stopRegimenConcept) {
        addOrUpdateObsObject(categoryObs, obsArrayForPrevEncounter, setObsArrayForPrevEncounter);
      } else {
        addOrUpdateObsObject(categoryObs, obsArray, setObsArray);
      }
    }
    if (regimenEvent && category === 'TB') {
      const categoryObs = {
        concept: Regimen.tbCategoryConcept,
        value: regimenEvent,
      };
      if (regimenEvent === Regimen.stopRegimenConcept) {
        addOrUpdateObsObject(categoryObs, obsArrayForPrevEncounter, setObsArrayForPrevEncounter);
      } else {
        addOrUpdateObsObject(categoryObs, obsArray, setObsArray);
      }
    }
  }, [
    standardRegimenLine,
    regimenReason,
    standardRegimen,
    category,
    regimenEvent,
    visitDate,
    obsArray,
    obsArrayForPrevEncounter,
  ]);

  useEffect(() => {
    if (
      selectedRegimenType === 'nonStandardUuid' &&
      nonStandardRegimens.length > 0 &&
      regimenEvent !== Regimen.stopRegimenConcept
    ) {
      setObsArray((prevObsArray) => {
        // Create a map to track distinct values based on the 'value' key
        const distinctValuesMap = new Map();
        prevObsArray.forEach((item) => {
          distinctValuesMap.set(item.value, item);
        });
        // Add or update items from nonStandardRegimens to the map based on the 'value' key
        nonStandardRegimens.forEach((item) => {
          distinctValuesMap.set(item.value, item);
        });
        const uniqueObsArray = Array.from(distinctValuesMap.values());
        return uniqueObsArray;
      });
    }
  }, [selectedRegimenType, nonStandardRegimens, regimenEvent]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      setIsSubmitting(true);

      const encounterToSave: Encounter = {
        encounterDatetime: toDateObjectStrict(
          toOmrsIsoString(new Date(dayjs(visitDate).year(), dayjs(visitDate).month(), dayjs(visitDate).date())),
        ),
        patient: patientUuid,
        encounterType: Regimen.regimenEncounterType,
        location: sessionUser?.sessionLocation?.uuid,
        encounterProviders: [
          {
            provider: sessionUser?.currentProvider?.uuid,
            encounterRole: config.regimenObs.encounterProviderRoleUuid,
          },
        ],
        form: Regimen.regimenForm,
        obs: obsArray,
      };
      const encounterToUpdate: UpdateObs = {
        obs: obsArrayForPrevEncounter,
      };
      if (regimenEncounter.uuid) {
        updateEncounter(encounterToUpdate, regimenEncounter.uuid);
        closeWorkspace();
      }
      if (obsArray.length > 0) {
        saveEncounter(encounterToSave).then(
          (response) => {
            if (response.status === 201) {
              showSnackbar({
                kind: 'success',
                title: t('regimenUpdated', 'Regimen updated'),
                subtitle: t('regimenUpdatedSuccessfully', `Regimen updated successfully.`),
                autoClose: true,
              });
              setIsSubmitting(false);
              mutate(`${restBaseUrl}/currentProgramDetails?patientUuid=${patientUuid}`);
              mutate(`${restBaseUrl}/patientSummary?patientUuid=${patientUuid}`);
              mutate(`${restBaseUrl}/regimenHistory?patientUuid=${patientUuid}&category=${category}`);
              mutate(`${restBaseUrl}/lastRegimenEncounter?patientUuid=${patientUuid}&category=${category}`);

              closeWorkspace();
            }
          },
          (error) => {
            showNotification({
              title: t('regimenError', 'Error updating regimen'),
              kind: 'error',
              critical: true,
              description: error?.message,
              millis: 3000,
            });
          },
        );
      }
    },
    [
      patientUuid,
      t,
      category,
      visitDate,
      obsArray,
      obsArrayForPrevEncounter,
      sessionUser?.currentProvider?.uuid,
      regimenEncounter.uuid,
      sessionUser?.sessionLocation?.uuid,
      config.regimenObs.encounterProviderRoleUuid,
      closeWorkspace,
    ],
  );

  return (
    <Form className={styles.form} onSubmit={handleSubmit}>
      <div>
        <Stack gap={8} className={styles.container}>
          <h4 className={styles.regimenTitle}>Current Regimen: {onRegimen}</h4>
          <section className={styles.section}>
            <div className={styles.sectionTitle}>{t('regimenEvent', 'Regimen event')}</div>
            <RadioButtonGroup
              className={styles.radioButtonWrapper}
              name="regimenEvent"
              onChange={(uuid) => {
                setRegimenEvent(uuid);
              }}
            >
              <RadioButton
                key={'start-regimen'}
                labelText={t('startRegimen', 'Start')}
                value={Regimen.startOrRestartConcept}
                disabled={lastRegimenEncounter.uuid}
              />

              <RadioButton
                key={'restart-regimen'}
                labelText={t('restartRegimen', 'Restart')}
                value={Regimen.startOrRestartConcept}
                disabled={!lastRegimenEncounter.endDate && lastRegimenEncounter.event !== 'STOP ALL'}
              />

              <RadioButton
                key={'change-regimen'}
                labelText={t('changeRegimen', 'Change')}
                value={Regimen.changeRegimenConcept}
                disabled={!lastRegimenEncounter.startDate || lastRegimenEncounter.event === 'STOP ALL'}
              />
              <RadioButton
                key={'stop-regimen'}
                labelText={t('stopRegimen', 'Stop')}
                value={Regimen.stopRegimenConcept}
                disabled={lastRegimenEncounter.endDate || (!lastRegimenEncounter.uuid && !lastRegimenEncounter.endDate)}
              />
            </RadioButtonGroup>
            {regimenEvent ? (
              <>
                {regimenEvent !== 'undo' ? (
                  <DatePicker
                    dateFormat="d/m/Y"
                    datePickerType="single"
                    id="regimenDate"
                    style={{ paddingBottom: '1rem' }}
                    maxDate={new Date().toISOString()}
                    onChange={([date]) => setVisitDate(date)}
                    value={visitDate}
                  >
                    <DatePickerInput
                      id="regimenDateInput"
                      labelText={t('date', 'Date')}
                      placeholder="dd/mm/yyyy"
                      style={{ width: '100%' }}
                    />
                  </DatePicker>
                ) : null}

                {regimenEvent && regimenEvent !== Regimen.stopRegimenConcept && regimenEvent !== 'undo' ? (
                  <>
                    <RadioButtonGroup
                      className={styles.radioButtonWrapper}
                      name="regimenType"
                      onChange={(uuid) => {
                        setSelectedRegimenType(uuid);
                      }}
                    >
                      <RadioButton key={'standardUuid'} labelText={'Use standard regimen'} value={'standardUuid'} />
                      <RadioButton
                        key={'nonStandardUuid'}
                        labelText={'Use non standard regimen'}
                        value={'nonStandardUuid'}
                        disabled={category !== 'ARV'}
                      />
                    </RadioButtonGroup>
                    {selectedRegimenType === 'standardUuid' ? (
                      <StandardRegimen
                        category={category}
                        setStandardRegimen={setStandardRegimen}
                        setStandardRegimenLine={setStandardRegimenLine}
                        selectedRegimenType={selectedRegimenType}
                      />
                    ) : (
                      <NonStandardRegimen
                        category={category}
                        setNonStandardRegimens={setNonStandardRegimens}
                        setStandardRegimenLine={setStandardRegimenLine}
                        selectedRegimenType={selectedRegimenType}
                      />
                    )}
                  </>
                ) : null}

                {regimenEvent === Regimen.stopRegimenConcept ||
                (regimenEvent === Regimen.changeRegimenConcept && selectedRegimenType) ? (
                  <RegimenReason category={category} setRegimenReason={setRegimenReason} />
                ) : null}
              </>
            ) : null}
          </section>
        </Stack>
      </div>
      <ButtonSet className={isTablet ? styles.tablet : styles.desktop}>
        <Button className={styles.button} kind="secondary" onClick={closeWorkspace}>
          {t('discard', 'Discard')}
        </Button>
        <Button className={styles.button} disabled={isSubmitting} kind="primary" type="submit">
          {t('save', 'Save')}
        </Button>
      </ButtonSet>
    </Form>
  );
};

export default RegimenForm;
