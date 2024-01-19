import { Button, Tooltip } from '@carbon/react';
import { CatalogPublish } from '@carbon/react/icons';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { showModal } from '@openmrs/esm-framework';
import { MappedPatientQueueEntry } from './patient-queues.resource';

interface NotesActionsMenuProps {
  note: MappedPatientQueueEntry;
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
    <Tooltip align="bottom" label="View Notes">
      <Button
        kind="ghost"
        onClick={launchNotesModal}
        iconDescription={t('viewNotes', 'View Notes')}
        renderIcon={(props) => <CatalogPublish size={16} {...props} />}
      />
    </Tooltip>
  );
};
export default NotesActionsMenu;
