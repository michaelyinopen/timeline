import React from 'react';

import ItemComponentContext from './ItemComponentContext';
import GroupComponentContext from './GroupComponentContext';
import ItemContent from './ItemContent';
import GroupContent from './GroupContent';

import classNames from 'classnames/bind';
import timelineStyles from './Timeline.module.css';

const cx = classNames.bind(timelineStyles);

// grid, tracker
// sets displayTime
// sets TrackerTime
const ControlledTimeContainer = React.memo(({
  itemComponent,
  groupComponent,
  children
}) => {
  return (
    <div className={cx("timeline__time-container")}>
      <GroupComponentContext.Provider value={groupComponent ? groupComponent : GroupContent}>
        <ItemComponentContext.Provider value={itemComponent ? itemComponent : ItemContent}>
          {children}
        </ItemComponentContext.Provider>
      </GroupComponentContext.Provider>
    </div>
  );
});

export default ControlledTimeContainer;