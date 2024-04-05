import React from 'react';
import CompletedList from './data-table/completed-list.component';

const completedTab = () => {
  return (
    <div>
      <CompletedList fulfillerStatus={'COMPLETED'} />
    </div>
  );
};

export default completedTab;
