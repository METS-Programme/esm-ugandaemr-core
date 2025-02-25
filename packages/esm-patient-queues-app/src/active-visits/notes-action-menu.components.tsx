import React, { useCallback } from 'react';
import { Button } from '@carbon/react';
import { CatalogPublish } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { showModal } from '@openmrs/esm-framework';
import { PatientQueue } from '../types/patient-queues';

interface NotesActionsMenuProps {
  note: PatientQueue;
}

const NotesActionsMenu: React.FC<NotesActionsMenuProps> = ({ note }) => {
  const { t } = useTranslation();
  const launchNotesModal = useCallback(() => {
    const dispose = showModal('notes-dialog-modal', {
      queueEntry: note,
      closeModal: () => dispose(),
    });
  }, [note]);
  return (
    <div>
      <Button
        kind="ghost"
        onClick={launchNotesModal}
        iconDescription={t('viewNotes', 'View Notes')}
        renderIcon={(props) => <CatalogPublish size={16} {...props} />}
      />
    </div>
  );
};
export default NotesActionsMenu;
