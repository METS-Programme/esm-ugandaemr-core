import { ClickableTile } from '@carbon/react';
import React from 'react';
import { CarbonIconType } from '@carbon/react/icons';

interface ItemTileProps {
  title: string;
  icon: CarbonIconType;
  to?: string;
  href?: string;
  className?: string;
  iconSize?: number | string;
}

const Item: React.FC<ItemTileProps> = ({ title, icon: Icon, to, className, iconSize = 24, href }) => {
  // items
  const base =
    typeof window !== 'undefined' && typeof window.getOpenmrsSpaBase === 'function' ? window.getOpenmrsSpaBase() : '/';
  const finalHref = href ?? `${base}${to ?? ''}`;

  return (
    <ClickableTile className={className} id="menu-item" href={`${finalHref}`}>
      <div className="customTileTitle">{<Icon size={iconSize} />}</div>
      <div>{title}</div>
    </ClickableTile>
  );
};
export default Item;
