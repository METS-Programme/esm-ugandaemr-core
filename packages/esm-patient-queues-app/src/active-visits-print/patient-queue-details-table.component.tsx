import React from 'react';
import { MappedPatientQueueEntry } from '../active-visits/patient-queues.resource';
import styles from './active-visits-print.scss';
import { trimVisitNumber } from '../helpers/functions';

interface PrintTableProps {
  queueEntry: MappedPatientQueueEntry;
}

const PatientQueueDetailsTable: React.FC<PrintTableProps> = ({ queueEntry }) => {
  return (
    <table>
      <tbody>
        <tr className={styles.name}>
          <td align="right">Visit No:</td>
          <td>{trimVisitNumber(queueEntry.visitNumber)}</td>
        </tr>
        <tr className={styles.name}>
          <td align="right">Entry Point:</td>
          <td>{queueEntry.creatorDisplay}</td>
        </tr>

        <tr className={styles.name}>
          <td align="right">Attendant:</td>
          <td>{queueEntry.creatorUsername}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PatientQueueDetailsTable;
