import React from 'react';
import { usePatientQueuesByParentLocation } from '../queue-board.resource';
import { SkeletonPlaceholder, SkeletonText } from '@carbon/react';
import styles from './base-board.scss';
import { TicketCard } from './ticket-card.component';

interface BaseBoardProps {
  title: string;
  status: string;
  hasBorder?: boolean;
  isFullScreen: boolean;
}

const BaseBoardComponent: React.FC<BaseBoardProps> = ({ title, status, hasBorder, isFullScreen }) => {
  const { patientQueues, isLoading, isError } = usePatientQueuesByParentLocation(status);

  if (isLoading || isError || !patientQueues)
    return (
      <div>
        <SkeletonText />
        <div className={styles.gridFlow}>
          {[...Array(hasBorder ? 5 : 1).keys()].map(() => (
            <SkeletonPlaceholder
              style={{
                width: '30%',
                margin: '1.5rem',
                padding: '1.3rem',
              }}
            />
          ))}
        </div>
      </div>
    );

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
        {patientQueues
          .sort((a, b) => (a.dateCreated < b.dateCreated ? 0 : 1))
          .map((queueEntry) => {
            return <TicketCard queue={queueEntry} />;
          })}
      </div>
    </div>
  );
};

export default BaseBoardComponent;
