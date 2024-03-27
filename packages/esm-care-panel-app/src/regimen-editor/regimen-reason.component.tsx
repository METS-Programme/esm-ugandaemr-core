import { Select, SelectItem } from '@carbon/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRegimenReason } from '../hooks/useRegimenReason';
import styles from './standard-regimen.scss';

interface RegimenReasonProps {
  category: string;
  setRegimenReason: (value: any) => void;
}

const RegimenReason: React.FC<RegimenReasonProps> = ({ category, setRegimenReason }) => {
  const { t } = useTranslation();
  const { regimenReason, isLoading, error } = useRegimenReason();

  const [selectedRegimenReason, setSelectedRegimenReason] = useState('');
  const matchingCategory = regimenReason.find((item) => item.category === category);

  const handleRegimenReasonChange = (e) => {
    setSelectedRegimenReason(e.target.value);
    setRegimenReason(e.target.value);
  };

  return (
    <div>
      <>
        <Select
          id="regimenReason"
          invalidText="Required"
          labelText={t('selectReason', 'Select Reason')}
          className={styles.inputContainer}
          value={selectedRegimenReason}
          onChange={handleRegimenReasonChange}
        >
          {!selectedRegimenReason || selectedRegimenReason == '--' ? (
            <SelectItem text={t('selectReason', 'Select Reason')} value="" />
          ) : null}
          {matchingCategory?.reason.map((reason) => (
            <SelectItem key={reason.label} text={reason.label} value={reason.value}>
              {reason.label}
            </SelectItem>
          ))}
        </Select>
      </>
    </div>
  );
};

export default RegimenReason;
