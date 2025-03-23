import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from '@carbon/react';
import styles from './app-search-bar.scss';

import { Extension, ExtensionSlot, useAssignedExtensions } from '@openmrs/esm-framework';

const appMenuItemSlot = 'app-menu-item-slot';

interface AppSearchBarProps {
  onChange?: (searchTerm: string) => void;
  onClear: () => void;
  onSubmit: (searchTerm: string) => void;
  small?: boolean;
}

const AppSearchBar = React.forwardRef<HTMLInputElement, AppSearchBarProps>(
  ({ onChange, onClear, onSubmit, small }, ref) => {
    const appMenuItems = useAssignedExtensions(appMenuItemSlot);
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
      onChange?.(value);
    };

    const handleSubmit = (evt: React.FormEvent) => {
      evt.preventDefault();
      onSubmit?.(searchTerm);
    };

    const filteredExtensions = useMemo(() => {
      return appMenuItems.filter((extension) =>
        (extension?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }, [searchTerm, appMenuItems]);

    return (
      <>
        <form onSubmit={handleSubmit} className={styles.searchArea}>
          <Search
            autoFocus
            className={styles.appSearchInput}
            closeButtonLabelText={t('clearSearch', 'Clear')}
            labelText=""
            onChange={handleChange}
            onClear={onClear}
            placeholder={t('searchForApp', 'Search for an application')}
            size={small ? 'sm' : 'lg'}
            value={searchTerm}
            ref={ref}
            data-testid="appSearchBar"
          />
        </form>
        <div className={styles.searchItems}>
          <ExtensionSlot name={appMenuItemSlot}>
            {filteredExtensions.map(() => (
              <Extension />
            ))}
          </ExtensionSlot>
        </div>
      </>
    );
  },
);

export default AppSearchBar;
