import { Button } from '@carbon/react';
import { showModal } from '@openmrs/esm-framework';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface EndVisitActionButtonProps {
  uuid: string;
  patientUuid: string;
}

const EndVisitActionButton: React.FC<EndVisitActionButtonProps> = ({ uuid, patientUuid }) => {
  const { t } = useTranslation();

  const launchEndVisitModal = useCallback(() => {
    const dispose = showModal('end-visit-modal', {
      closeModal: () => dispose(),
      uuid,
      patientUuid,
    });
  }, []);

  return (
    <li className="cds--overflow-menu-options__option">
      <button
        className="cds--overflow-menu-options__btn"
        role="menuitem"
        title={t('endAVisit', 'End a visit')}
        data-floating-menu-primary-focus
        onClick={launchEndVisitModal}
        style={{
          maxWidth: '100vw',
        }}
      >
        <span className="cds--overflow-menu-options__option-content">{t('endAVisit', 'End a visit')}</span>
      </button>
    </li>
  );
};

export default EndVisitActionButton;
