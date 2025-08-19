import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderGlobalAction } from '@carbon/react';
import { Close, Switcher } from '@carbon/react/icons';
import AppSearchOverlay from '../app-search-overlay/app-search-overlay.component';
import styles from './app-search-icon.scss';

interface AppSearchLaunchProps {}

const AppSearchLaunch: React.FC<AppSearchLaunchProps> = () => {
  const { t } = useTranslation();
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleGlobalAction = useCallback(() => {
    if (showSearchInput) {
      setShowSearchInput(false);
    } else {
      setShowSearchInput(true);
    }
  }, [setShowSearchInput, showSearchInput]);

  console.log('app mounted');
  return (
    <div>
      {showSearchInput && <AppSearchOverlay onClose={handleGlobalAction} query={''} />}

      <div>
        <HeaderGlobalAction
          aria-label={t('searchApp', 'Search App')}
          aria-labelledby="Search App"
          className={`${showSearchInput ? styles.activeSearchIconButton : styles.searchIconButton}`}
          data-testid="searchAppIcon"
          onClick={handleGlobalAction}
        >
          {showSearchInput ? <Close size={20} /> : <Switcher size={20} />}
        </HeaderGlobalAction>
      </div>
    </div>
  );
};

export default AppSearchLaunch;
