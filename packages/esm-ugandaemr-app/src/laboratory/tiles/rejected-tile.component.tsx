import React from 'react';
import { useTranslation } from 'react-i18next';
import SummaryTile from './summary-tile.component';
import { useGetOrdersWorklist } from '../resource';

const RejectedTile = () => {
  const { t } = useTranslation();

  const { data } = useGetOrdersWorklist('');

  const filteredData = data?.filter((item) => item?.fulfillerStatus === 'EXCEPTION');

  return (
    <SummaryTile
      label={t('orders', 'Tests')}
      value={filteredData?.length}
      headerLabel={t('testsRejected', 'Rejected')}
    />
  );
};

export default RejectedTile;
