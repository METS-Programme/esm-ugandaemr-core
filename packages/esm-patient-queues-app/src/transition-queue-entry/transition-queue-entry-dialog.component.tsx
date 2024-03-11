import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import {
  ConfigObject,
  ExtensionSlot,
  formatDatetime,
  navigate,
  parseDate,
  showNotification,
  showToast,
  useConfig,
} from '@openmrs/esm-framework';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MappedVisitQueueEntry, useVisitQueueEntries } from '../active-visits/active-visits-table.resource';
import { findObsByConceptUUID } from '../helpers/functions';
import { usePastVisits } from '../past-visit/past-visit.resource';
import { usePatientAppointments } from '../queue-patient-linelists/queue-linelist.resource';
import styles from './transition-queue-entry-dialog.scss';
import { requeueQueueEntry } from './transition-queue-entry.resource';

interface TransitionQueueEntryModalProps {
  queueEntry: MappedVisitQueueEntry;
  closeModal: () => void;
}

enum priorityComment {
  REQUEUED = 'Requeued',
}

const TransitionQueueEntryModal: React.FC<TransitionQueueEntryModalProps> = ({ queueEntry, closeModal }) => {
  const { t } = useTranslation();

  const config = useConfig() as ConfigObject;
  const defaultTransitionStatus = config.concepts.defaultTransitionStatus;

  const preferredIdentifiers = queueEntry?.identifiers.filter((identifier) =>
    config.defaultIdentifierTypes.includes(identifier?.identifierType?.uuid),
  );

  const startDate = dayjs(new Date().toISOString()).subtract(6, 'month').toISOString();
  const { upcomingAppointment, isLoading } = usePatientAppointments(queueEntry?.patientUuid, startDate);
  const { visits, isLoading: loading } = usePastVisits(queueEntry?.patientUuid);
  const obsToDisplay =
    !loading && visits ? findObsByConceptUUID(visits?.encounters, config.concepts.historicalObsConceptUuid) : [];
  const { mutate } = useVisitQueueEntries('', '');
  const provider = '';

  // const launchEditPriorityModal = useCallback(() => {
  //   updateQueueEntry(provider, queueEntry?.visitUuid, queueEntry?.queueUuid, queueEntry?.queueUuid).then(
  //     ({ status }) => {
  //       if (status === 201) {
  //         serveQueueEntry(queueEntry?.service, queueEntry?.visitQueueNumber, 'serving').then(({ status }) => {
  //           if (status === 200) {
  //             showToast({
  //               critical: true,
  //               title: t('success', 'Success'),
  //               kind: 'success',
  //               description: t('patientAttendingService', 'Patient attending service'),
  //             });
  //             closeModal();
  //             mutate();
  //             navigate({ to: `\${openmrsSpaBase}/patient/${queueEntry?.patientUuid}/chart` });
  //           }
  //         });
  //       }
  //     },
  //     (error) => {
  //       showNotification({
  //         title: t('queueEntryUpdateFailed', 'Error updating queue entry'),
  //         kind: 'error',
  //         critical: true,
  //         description: error?.message,
  //       });
  //     },
  //   );
  // }, [
  //   closeModal,
  //   mutate,
  //   queueEntry?.patientUuid,
  //   queueEntry?.queueUuid,
  //   queueEntry?.service,
  //   queueEntry?.visitQueueNumber,
  //   queueEntry?.visitUuid,
  //   t,
  // ]);

  const handleRequeuePatient = useCallback(() => {
    requeueQueueEntry(priorityComment.REQUEUED, queueEntry?.queueUuid, queueEntry?.queueEntryUuid).then(
      ({ status }) => {
        if (status === 200) {
          showToast({
            critical: true,
            title: t('success', 'Success'),
            kind: 'success',
            description: t('patientRequeued', 'Patient has been requeued'),
          });
          closeModal();
          mutate();
        }
      },
      (error) => {
        showNotification({
          title: t('queueEntryUpdateFailed', 'Error updating queue entry'),
          kind: 'error',
          critical: true,
          description: error?.message,
        });
      },
    );
  }, [closeModal, mutate, queueEntry?.queueEntryUuid, queueEntry?.queueUuid, t]);

  return (
    <div>
      <ModalHeader closeModal={closeModal} title={t('servePatient', 'Serve patient')} />
      <ModalBody className={styles.modalBody}>
        <div>
          <section className={styles.modalBody}>
            <p className={styles.p}>
              {t('patientName', 'Patient name')} : &nbsp; {queueEntry?.name}
            </p>
            {preferredIdentifiers?.length
              ? preferredIdentifiers.map((identifier) => (
                  <p className={styles.p}>
                    {identifier?.identifierType?.display} : &nbsp; {identifier?.identifier}
                  </p>
                ))
              : ''}
            <p className={styles.p}>
              {t('lastClinicalVisit', 'Last clinical visit')} : &nbsp; {loading && t('loading', 'Loading...')}
              {!loading && !visits && t('none', 'None')}
              {visits && formatDatetime(parseDate(visits?.startDatetime))}
            </p>
            {obsToDisplay?.length
              ? obsToDisplay.map((o) => (
                  <p className={styles.p}>
                    {o.concept.display} : &nbsp; {o.value.display}
                  </p>
                ))
              : ''}
            <p className={styles.p}>
              {t('tcaDate', 'Tca date')} : &nbsp; {isLoading && t('loading', 'Loading...')}
              {!isLoading && !upcomingAppointment && t('none', 'None')}
              {upcomingAppointment && formatDatetime(parseDate(upcomingAppointment?.startDateTime))}
            </p>
          </section>
          <ExtensionSlot
            className={styles.visitSummaryContainer}
            name="previous-visit-summary-slot"
            state={{
              patientUuid: queueEntry?.patientUuid,
            }}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={() => handleRequeuePatient()}>
          {t('requeue', 'Requeue')}
        </Button>
        <Button>{t('serve', 'Serve')}</Button>
      </ModalFooter>
    </div>
  );
};

export default TransitionQueueEntryModal;
