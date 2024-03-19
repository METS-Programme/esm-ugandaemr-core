import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchTypes } from '../types';
import Overlay from '../overlay.component';
import { ExtensionSlot, usePatient } from '@openmrs/esm-framework';
import VisitForm from '../visit-form/visit-form.component';

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
  const [searchType, setSearchType] = useState<SearchTypes>(
    view === 'queue_service_form'
      ? SearchTypes.QUEUE_SERVICE_FORM
      : view === 'queue_room_form'
      ? SearchTypes.QUEUE_ROOM_FORM
      : SearchTypes.VISIT_FORM,
  );
  const [newVisitMode, setNewVisitMode] = useState<boolean>(false);

  const toggleSearchType = (searchType: SearchTypes, mode: boolean = false) => {
    setSearchType(searchType);
    setNewVisitMode(mode);
  };

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
          {searchType === SearchTypes.VISIT_FORM ? (
            <VisitForm
              patientUuid={selectedPatientUuid}
              toggleSearchType={toggleSearchType}
              closePanel={closePanel}
              mode={newVisitMode}
            />
          ) : null}
        </div>
      </Overlay>
    </>
  );
};

export default PatientSearch;
