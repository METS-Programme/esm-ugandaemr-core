import React, { useCallback } from 'react';

import { Button, Tooltip } from '@carbon/react';
import { Send } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { launchWorkspace } from '@openmrs/esm-framework';

type MovetoNextServicePointPatientActionProps = {};

const MovetoNextServicePointReassignAction: React.FC<MovetoNextServicePointPatientActionProps> = ({}) => {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    launchWorkspace('move-to-next-service-point-form-workspace', {
      workspaceTitle: t('moveToNextServicePoint', 'Move to next service point'),
    });
  }, []);

  return (
     <Button
        kind="ghost"
        onClick={handleClick}
        iconDescription={t('reassignPatient', 'ReAssign Patient')}
        renderIcon={(props) => <Send size={16} {...props} />}
      />
  );
};
export default MovetoNextServicePointReassignAction;
