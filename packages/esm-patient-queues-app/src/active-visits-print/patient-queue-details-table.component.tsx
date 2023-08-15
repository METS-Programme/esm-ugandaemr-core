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
          <td align="right">Check In Date:&nbsp;</td>
          <td>{queueEntry.dateCreated}</td>
        </tr>
        <tr className={styles.name}>
          <td align="right">Patient Name:&nbsp;</td>
          <td>{queueEntry.name}</td>
        </tr>
        <tr className={styles.name}>
          <td align="right">Visit No:&nbsp;</td>
          <td>{trimVisitNumber(queueEntry.visitNumber)}</td>
        </tr>
        <tr className={styles.name}>
          <td align="right">Gender:&nbsp;</td>
          <td>{queueEntry.patientSex}</td>
        </tr>
        <tr className={styles.name}>
          <td align="right">Entry Point:&nbsp;</td>
          <td>{queueEntry.creatorDisplay}</td>
        </tr>

        <tr className={styles.name}>
          <td align="right">Attendant:&nbsp;</td>
          <td>{queueEntry.creatorUsername}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PatientQueueDetailsTable;
