import React from 'react';
import ReviewList from './data-table/review-list.component';

const ReviewTab = () => {
  return (
    <div>
      <ReviewList fulfillerStatus={'IN_PROGRESS'} />
    </div>
  );
};

export default ReviewTab;
