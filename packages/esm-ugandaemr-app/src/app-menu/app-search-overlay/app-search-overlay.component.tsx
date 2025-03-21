import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Overlay from "../../overlay/overlay";
import AppSearchBar from "../app-search-bar/app-search-bar.component";
import debounce from "lodash-es/debounce";

interface AppSearchOverlayProps {
  onClose: () => void;
  query?: string;
  header?: string;
}

const AppSearchOverlay: React.FC<AppSearchOverlayProps> = ({
  onClose,
  query = "",
  header,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(query);
  const handleClear = useCallback(() => setSearchTerm(""), [setSearchTerm]);

  useEffect(() => {
    if (query) {
      setSearchTerm(query);
    }
  }, [query]);

  const onSearchQueryChange = debounce((val) => {
    setSearchTerm(val);
  }, 300);

  return (
    <Overlay
      header={header ?? t("searchResults", "Search results")}
      close={onClose}
    >
      <AppSearchBar
        onSubmit={onSearchQueryChange}
        onChange={onSearchQueryChange}
        onClear={handleClear}
      />
    </Overlay>
  );
};

export default AppSearchOverlay;
