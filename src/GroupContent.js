import React from 'react';
import classNames from 'classnames/bind';
import timelineStyles from './Timeline.module.css';
const cx = classNames.bind(timelineStyles);

const GroupContent = ({
  id,
  children
}) => {
  return (
    <div className={cx("timeline__group-content")}>
      {children}
    </div>
  );
};

export default GroupContent;