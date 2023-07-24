import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './hts.scss';
import FacilityHtsCard from '../hts/cards/facility-hts-card.component';

const FacilityHtsTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.cardContainer}>
        <FacilityHtsCard label={t('assessments', 'Completed Assessments')} value={'--'} headerLabel={'Asssessments'} />
        <FacilityHtsCard label={t('positive', 'Patients tested postive')} value={'--'} headerLabel={'Positive'} />
        <FacilityHtsCard label={t('negative', 'People tested negative')} value={'--'} headerLabel={'Negative'} />
      </div>
    </>
  );
};

export default FacilityHtsTab;
