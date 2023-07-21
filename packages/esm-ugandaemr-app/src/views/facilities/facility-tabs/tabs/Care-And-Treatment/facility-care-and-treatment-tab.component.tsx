import React from 'react';
import FacilityCareAndTreatmentCard from './cards/facility-care-and-treatment-card.component';
import styles from './care-and-treatment.scss';
import { useTranslation } from 'react-i18next';

const FacilityCareAndTreatmentTab: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.cardContainer}>
        <FacilityCareAndTreatmentCard
          label={t('active', 'Patients in care population')}
          value={'--'}
          headerLabel={'Active Patients'}
        />
        <FacilityCareAndTreatmentCard
          label={t('exposedInfants', 'Infants exposed in population')}
          value={'--'}
          headerLabel={'Exposed Infants'}
        />
        <FacilityCareAndTreatmentCard
          label={t('backToCare', 'Patients back to care')}
          value={'--'}
          headerLabel={'Back to Care'}
        />
      </div>
    </>
  );
};

export default FacilityCareAndTreatmentTab;
