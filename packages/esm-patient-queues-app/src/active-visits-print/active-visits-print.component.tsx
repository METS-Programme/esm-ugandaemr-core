import { useSession } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MappedPatientQueueEntry } from '../active-visits/patient-queues.resource';
import { trimVisitNumber } from '../helpers/functions';
import styles from './active-visits-print.scss';

interface VisitCardToPrintProps {
  queueEntry: MappedPatientQueueEntry;
}

export function VisitCardToPrint({ queueEntry }: VisitCardToPrintProps) {
  const session = useSession();
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.printPage}>
        <div className={styles.container}>
          <div>Visit No.</div>
          <div>{trimVisitNumber(queueEntry.visitNumber)}</div>
          <div>
            <span> Qr Code goes here </span>
          </div>
          <div>
            <span> !!!Thank you for visiting us Today !!!</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default VisitCardToPrint;
