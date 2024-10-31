import React, { AnchorHTMLAttributes } from 'react';

import { Button } from '@carbon/react';
import { Dashboard } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { navigate } from '@openmrs/esm-framework';

interface NameLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  from: string;
}

const ViewActionsMenu: React.FC<NameLinkProps> = ({ from, to }) => {
  const { t } = useTranslation();

  const handleNameClick = (event: MouseEvent, to: string) => {
    event.preventDefault();
    navigate({ to });
    localStorage.setItem('fromPage', from);
  };

  return (
    <div>
      <Button
        kind="ghost"
        onClick={(e) => handleNameClick(e, to)}
        iconDescription={t('viewPatient', 'View Patient')}
        renderIcon={(props) => <Dashboard size={16} {...props} />}
      />
    </div>
  );
};
export default ViewActionsMenu;
