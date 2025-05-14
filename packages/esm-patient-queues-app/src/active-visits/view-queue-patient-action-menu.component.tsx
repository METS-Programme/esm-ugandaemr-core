import React, { AnchorHTMLAttributes, useCallback, useEffect } from 'react';

import { Button } from '@carbon/react';
import { Dashboard } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { navigate } from '@openmrs/esm-framework';
import { updateSelectedPatientQueueUuid } from '../helpers/helpers';

interface NameLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  from: string;
  queueUuid: string;
}

const ViewQueuePatientActionMenu: React.FC<NameLinkProps> = ({ from, to, queueUuid }) => {
  const { t } = useTranslation();

  console.log('queueUuid-->2', queueUuid);

  useEffect(() => {
    if (queueUuid) {
      updateSelectedPatientQueueUuid(queueUuid);
    }
  }, [queueUuid]);

  const handleNameClick = useCallback(
    (event: any) => {
      event.preventDefault();
      localStorage.setItem('fromPage', from);
      navigate({ to });
    },
    [from, to],
  );

  return (
    <div>
      <Button
        kind="ghost"
        onClick={handleNameClick}
        iconDescription={t('viewPatient', 'View Patient')}
        renderIcon={(props) => <Dashboard size={16} {...props} />}
      />
    </div>
  );
};

export default ViewQueuePatientActionMenu;
