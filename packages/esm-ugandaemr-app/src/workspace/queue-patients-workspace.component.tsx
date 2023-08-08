import React from 'react';

import ActiveVisitsTable from '../../../esm-patient-queues-app/src/active-visits/active-visits-table.component';
import PatientsInNextQueueRoomTable from '../../../esm-patient-queues-app/src/patients-in-next-room/patients-in-next-room-table.component';
import styles from './queue-patients-wsp.scss';
export default function QueuePatientsWorkSpace() {
  return (
    <>
      <div>
        <section className={styles.section}>
          <div className={styles.title}>Incoming</div>
          <ActiveVisitsTable status={'pending'} />
        </section>

        <section className={styles.section}>
          <div className={styles.title}>Patients in Next Queue Room</div>
          <PatientsInNextQueueRoomTable />
        </section>
      </div>
    </>
  );
}
