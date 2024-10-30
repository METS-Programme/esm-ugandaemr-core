import React from 'react';
import { MappedPatientQueueEntry } from '../patient-queues.resource';
import styles from './active-visits-print.scss';
import { trimVisitNumber } from '../../helpers/functions';
import { formatDate, parseDate, useSession } from '@openmrs/esm-framework';

interface PrintTableProps {
  queueEntry: MappedPatientQueueEntry;
}

const PatientQueueDetailsTable: React.FC<PrintTableProps> = ({ queueEntry }) => {
  const currentUserSession = useSession();

  return (
    <table>
      <tbody>
        <tr className={styles.name}>
          <td align="right">Visit No:</td>
          <td>{trimVisitNumber(queueEntry.visitNumber)}</td>
        </tr>
        <tr className={styles.name}>
          <td align="right">Date Created:</td>
          <td>{formatDate(parseDate(queueEntry.dateCreated), { time: true, mode: 'standard', noToday: true })}</td>
        </tr>
        <tr className={styles.name}>
          <td align="right">Entry Point:</td>
          <td>{currentUserSession?.sessionLocation?.display}</td>
        </tr>

        <tr className={styles.name}>
          <td align="right">Attendant:</td>
          <td>{currentUserSession.user?.person?.display}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PatientQueueDetailsTable;
