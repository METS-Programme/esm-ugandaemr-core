import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchTypes } from '../types';
import Overlay from '../overlay.component';
import { ExtensionSlot, usePatient } from '@openmrs/esm-framework';
import VisitForm from '../active-visits/visit-form/visit-form.component';

interface PatientSearchProps {
  closePanel: () => void;
  view?: string;
  viewState: {
    selectedPatientUuid?: string;
  };
  headerTitle?: string;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ closePanel, view, viewState, headerTitle }) => {
  const { t } = useTranslation();
  const { selectedPatientUuid } = viewState;
  const { patient } = usePatient(selectedPatientUuid);

  const [newVisitMode, setNewVisitMode] = useState<boolean>(false);

  return (
    <>
      <Overlay header={headerTitle} closePanel={closePanel}>
        {patient && (
          <ExtensionSlot
            name="patient-header-slot"
            state={{
              patient,
              patientUuid: selectedPatientUuid,
              hideActionsOverflow: true,
            }}
          />
        )}
        <div className="omrs-main-content">
          <VisitForm patientUuid={selectedPatientUuid} closePanel={closePanel} mode={newVisitMode} />
        </div>
      </Overlay>
    </>
  );
};

export default PatientSearch;
