import React from 'react';
import { PatientQueue } from '../../types/patient-queues';
import styles from './base-board.scss';
import { TicketCard } from './ticket-card.component';

interface BaseBoardProps {
  title: string;
  data: PatientQueue[];
  hasBorder?: boolean;
  isFullScreen: boolean;
}

const BaseBoardComponent: React.FC<BaseBoardProps> = ({ title, data, hasBorder, isFullScreen }) => {
  return (
    <div
      style={{
        borderRight: hasBorder ? '1px solid grey' : '',
        height: isFullScreen ? '100vh' : 'calc(100vh - 50px)',
        overflow: 'scroll',
        paddingRight: hasBorder ? '20px' : '',
      }}
    >
      <h1 className={styles.heading}>{title}</h1>
      <div className={styles.gridFlow}>
        {data
          .sort((a, b) => (a.dateCreated < b.dateCreated ? 0 : 1))
          .map((queueEntry) => {
            return <TicketCard queue={queueEntry} />;
          })}
      </div>
    </div>
  );
};

export default BaseBoardComponent;
