import React, { useState } from 'react';
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

    const handleChange = (val: string) => {
      setSearchTerm(val);
      if (onChange) {
        onChange(val);
      }
    };

    const handleSubmit = (evt: React.FormEvent) => {
      evt.preventDefault();
      if (onSubmit) {
        onSubmit(searchTerm);
      }
    };

    const filteredExtensions = appMenuItems
      .filter((extension) => {
        const itemName = extension?.name ?? '';
        return itemName.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .map(() => (
        <ExtensionSlot name={appMenuItemSlot}>
          <Extension />
        </ExtensionSlot>
      ));

    return (
      <>
        <form onSubmit={handleSubmit} className={styles.searchArea}>
          <Search
            autoFocus
            className={styles.appSearchInput}
            closeButtonLabelText={t('clearSearch', 'Clear')}
            labelText=""
            onChange={(event) => handleChange(event.target.value)}
            onClear={onClear}
            placeholder={t('searchForApp', 'Search for an application')}
            size={small ? 'sm' : 'lg'}
            value={searchTerm}
            ref={ref}
            data-testid="appSearchBar"
          />
        </form>
        <div className={styles.searchItems}>
          {searchTerm
            ? filteredExtensions
            : appMenuItems.map(() => (
                <ExtensionSlot name={appMenuItemSlot}>
                  <Extension />
                </ExtensionSlot>
              ))}
        </div>
      </>
    );
  },
);

export default AppSearchBar;
