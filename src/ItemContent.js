import React from 'react';
import { useItem } from './store/useSelector';
import classNames from 'classnames/bind';
import timelineStyles from './Timeline.module.css';

const cx = classNames.bind(timelineStyles);

const ItemContent = ({
  id
}) => {
  const item = useItem(id);
  return <div className={cx("timeline__item-content")}>Item: {item.title}</div>;
};

export default ItemContent;