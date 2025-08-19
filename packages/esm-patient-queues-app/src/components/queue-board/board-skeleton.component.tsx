import { SkeletonPlaceholder, SkeletonText } from '@carbon/react';
import styles from './base-board/base-board.scss';
import React from 'react';

export const BoardSkeleton: React.FC<{ tiles: number }> = ({ tiles = 1 }: { tiles: number }) => {
  return (
    <div>
      <SkeletonText />
      <div className={styles.gridFlow}>
        {[...Array(tiles).keys()].map(() => (
          <SkeletonPlaceholder className={styles.skeletonPlaceHolder} />
        ))}
      </div>
    </div>
  );
};
