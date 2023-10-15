import React from 'react';
import { DataTableSkeleton } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useActiveTickets } from './useActiveTickets';
import styles from './queue-screen.scss';
import { HomeHeader } from '@ugandaemr/esm-ugandaemr-commons-lib/src/index';
import { Events } from '@carbon/react/icons';

interface QueueScreenProps {}

const QueueScreen: React.FC<QueueScreenProps> = () => {
  const { t } = useTranslation();
  const { activeTickets, isLoading, error } = useActiveTickets();

  if (isLoading) {
    return <DataTableSkeleton row={5} className={styles.queueScreen} role="progressbar" />;
  }

  if (error) {
    return <div>Error</div>;
  }

  const rowData = activeTickets.map((ticket, index) => ({
    id: `${index}}`,
    room: ticket.room,
    ticketNumber: ticket.ticketNumber,
    status: ticket.status,
  }));

  return (
    <div>
      <HomeHeader headerTitle={t('patientqueues', 'Patient queue')} icon={<Events size={16} />} />
      <div className={styles.gridFlow}>
        {rowData.map((row) => (
          <div className={styles.card}>
            <p className={styles.subheader}>{t('ticketNumber', 'Ticket number')}</p>
            <p className={row.status === 'calling' ? styles.headerBlinking : styles.header}>{row.ticketNumber}</p>
            <p className={styles.subheader}>
              {t('room', 'Room')} &nbsp; : &nbsp; {row.room}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueScreen;
