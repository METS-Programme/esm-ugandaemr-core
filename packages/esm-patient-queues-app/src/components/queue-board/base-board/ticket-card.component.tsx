import styles from '../queue-board.scss';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PatientQueue } from '../../../types/patient-queues';
import { trimVisitNumber } from '../../../helpers/functions';

interface TicketCardProp {
  queue: PatientQueue;
}

export const TicketCard: React.FC<TicketCardProp> = ({ queue }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.card}>
      <p className={styles.subHeader}>{t('ticketNumber', 'Ticket number')}</p>
      <p className={queue.status === 'picked' ? styles.headerBlinking : styles.header}>
        {trimVisitNumber(queue.visitNumber)}
      </p>
      <p className={styles.subHeader}>
        {t('room', 'Room')} &nbsp; : &nbsp; {queue.locationTo?.name}
      </p>
    </div>
  );
};
