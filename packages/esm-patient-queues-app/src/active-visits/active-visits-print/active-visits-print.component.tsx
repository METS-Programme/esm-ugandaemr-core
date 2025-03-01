import React from 'react';
import styles from './active-visits-print.scss';
import { QRCodeSVG } from 'qrcode.react';

import PatientQueueDetailsTable from './patient-queue-details-table.component';
import { PatientQueue } from '../../types/patient-queues';

interface VisitCardToPrintProps {
  queueEntry: PatientQueue;
}

export function VisitCardToPrint({ queueEntry }: VisitCardToPrintProps) {
  const patientUIC = queueEntry.patient?.identifiers.find((item) => item.display.includes('Patient Unique  ID Code'));

  return (
    <div className={styles.printPage}>
      <div className={styles.container}>
        <h3 style={{ paddingBottom: '8px' }}>Visit Registration Receipt</h3>
        <PatientQueueDetailsTable queueEntry={queueEntry} />
        <div style={{ margin: '25px' }} className={styles.name}>
          {queueEntry?.patient?.identifiers.length > 0 && patientUIC ? (
            <QRCodeSVG value={patientUIC?.display.split('=')[1]} />
          ) : (
            <> NA</>
          )}
        </div>
        <div>
          <span className={styles.name}> !!!Thank you !!!</span>
        </div>
      </div>
    </div>
  );
}

export default VisitCardToPrint;
