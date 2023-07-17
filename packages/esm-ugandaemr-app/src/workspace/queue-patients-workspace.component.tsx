import React from 'react';

import ActiveVisitsTable from '../../../esm-patient-queues-app/src/active-visits/active-visits-table.component';
import styles from './queue-patients-wsp.scss';
export default function QueuePatientsWorkSpace() {
  return (
    <>
      <div>
        <section className={styles.section}>
          <div className={styles.title}>InQueue</div>
          <ActiveVisitsTable />
        </section>

        <section className={styles.section}>
          <div className={styles.title}>Workloads</div>
          <ActiveVisitsTable />
        </section>
      </div>
    </>
  );
}
