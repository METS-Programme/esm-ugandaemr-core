import React from 'react';
import { Button, Column, Grid } from '@carbon/react';
import { FitToScreen, ShrinkScreen } from '@carbon/react/icons';
import styles from './queue-board.scss';
import BaseBoardComponent from './base-board/base-board.component';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { usePatientQueueBoard } from './queue-board.resource';
import { BoardSkeleton } from './board-skeleton.component';
import { readTickets } from './voice.utils';
import { getPatientQueueWaitingList, updatePatientQueueWaitingList } from '../../helpers/functions';

const QueueBoardComponent: React.FC = () => {
  const handle = useFullScreenHandle();
  const { isError, isLoading, pending, picked } = usePatientQueueBoard();
  if (isLoading || isError) {
    return (
      <Grid>
        <Column sm={8} md={8} lg={8}>
          <BoardSkeleton tiles={5} />
        </Column>
        <Column sm={8} md={8} lg={8}>
          <BoardSkeleton tiles={1} />
        </Column>
      </Grid>
    );
  }

  // Notify user about being in serve list
  const waitingList = getPatientQueueWaitingList().getState();

  const waitingListIds = waitingList.queue.map((e) => e.uuid);
  const pickedFromWaiting = picked.filter((queue) => waitingListIds.includes(queue.uuid));

  readTickets(pickedFromWaiting).then(() => {
    updatePatientQueueWaitingList(pending);
  });

  return (
    <FullScreen handle={handle}>
      <div className={`${styles.boardBody} ${styles.expandContractButton}`}>
        <Button
          renderIcon={(props) =>
            handle.active ? <ShrinkScreen size={32} {...props} /> : <FitToScreen size={32} {...props} />
          }
          hasIconOnly
          kind={'ghost'}
          onClick={handle.active ? handle.exit : handle.enter}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        />
        <Grid>
          <Column sm={8} md={8} lg={8}>
            <BaseBoardComponent title={'Waiting'} data={pending} hasBorder={true} isFullScreen={handle.active} />
          </Column>
          <Column sm={8} md={8} lg={8}>
            <BaseBoardComponent title={'Serving'} data={picked} isFullScreen={handle.active} />
          </Column>
        </Grid>
      </div>
    </FullScreen>
  );
};

export default QueueBoardComponent;
