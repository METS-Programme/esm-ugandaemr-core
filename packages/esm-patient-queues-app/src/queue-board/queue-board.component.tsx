import React from 'react';
import { Button, Column, Grid } from '@carbon/react';
import { FitToScreen, ShrinkScreen } from '@carbon/react/icons';
import styles from './queue-board.scss';
import BaseBoardComponent from './base-board/base-board.component';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

const QueueBoardComponent: React.FC = () => {
  const handle = useFullScreenHandle();

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
            <BaseBoardComponent title={'Waiting'} status={'pending'} hasBorder={true} isFullScreen={handle.active} />
          </Column>
          <Column sm={8} md={8} lg={8}>
            <BaseBoardComponent title={'Serving'} status={'picked'} isFullScreen={handle.active} />
          </Column>
        </Grid>
      </div>
    </FullScreen>
  );
};

export default QueueBoardComponent;
