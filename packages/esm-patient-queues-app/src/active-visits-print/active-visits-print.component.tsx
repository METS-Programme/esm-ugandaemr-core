import { QRCodeSVG } from 'qrcode.react';
import React from 'react';
import { MappedPatientQueueEntry } from '../active-visits/patient-queues.resource';
import styles from './active-visits-print.scss';

import logo from '../images/ugandaemr_login_logo_green.png';
import PatientQueueDetailsTable from './patient-queue-details-table.component';

interface VisitCardToPrintProps {
  queueEntry: MappedPatientQueueEntry;
}

export function VisitCardToPrint({ queueEntry }: VisitCardToPrintProps) {
  const patientUIC = queueEntry.identifiers.find((item) => item.display.includes('Patient Unique  ID Code'));

  return (
    <div className={styles.printPage}>
      <div className={styles.container}>
        <img src={logo} alt="logo" height={150} />
        <h3 style={{ paddingBottom: '8px' }}>Visit Registration Receipt</h3>
        <PatientQueueDetailsTable queueEntry={queueEntry} />
        <div style={{ margin: '25px' }} className={styles.name}>
          {queueEntry.identifiers.length > 0 && patientUIC ? (
            <QRCodeSVG value={patientUIC?.display.split('=')[1]} />
          ) : (
            <> An Error occured</>
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
