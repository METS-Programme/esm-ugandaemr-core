import React, { AnchorHTMLAttributes } from 'react';
import { Button, Tooltip } from '@carbon/react';
import { Edit } from '@carbon/react/icons';
import { navigate } from '@openmrs/esm-framework';

import { useTranslation } from 'react-i18next';

interface NameLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  from: string;
}

const EditActionsMenu: React.FC<NameLinkProps> = ({ from, to }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Tooltip align="bottom-start" label={t('editPatientDetails', 'Edit patient details')}>
        <Button
          kind="ghost"
          onClick={() => {
            navigate({ to });
            localStorage.setItem('fromPage', from);
          }}
          iconDescription={t('editPatient', 'Edit Patient')}
          renderIcon={(props) => <Edit size={16} {...props} />}
        />
      </Tooltip>
    </div>
  );
};
export default EditActionsMenu;
