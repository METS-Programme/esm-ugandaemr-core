import React, { useCallback } from 'react';

import { Button, Tooltip } from '@carbon/react';
import { Send } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { launchWorkspace } from '@openmrs/esm-framework';
import { PatientQueue } from '../types/patient-queues';

type MovetoNextServicePointReassignPatientActionProps = {
  queueEntry: PatientQueue;
};

const MovetoNextServicePointReassignAction: React.FC<MovetoNextServicePointReassignPatientActionProps> = ({
  queueEntry,
}) => {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    launchWorkspace('move-to-next-service-point-form-workspace', {
      workspaceTitle: t('moveToNextServicePoint', 'Move to next service point'),
      queueEntry: queueEntry,
    });
  }, [t, queueEntry]);

  return (
    <Button
      kind="ghost"
      onClick={handleClick}
      iconDescription={t('reassignPatient', 'Re-assign patient')}
      renderIcon={(props) => <Send size={16} {...props} />}
    />
  );
};
export default MovetoNextServicePointReassignAction;
