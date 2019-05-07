import React, { useContext, useCallback } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { timelineThrottleWait } from './constants';
import ItemComponentContext from './ItemComponentContext';

import TimelineDispatchContext from './TimelineDispatchContext';
import { setItemHeight } from './store/actionCreators';

import { useItem } from './store/useSelector';
import { useItemTopHeight } from './store/groupItemHeight';
import { useScheduleElementXFunc } from './store/lengthTime';

import stopPropagationMouseDown from './stopPropagationMouseDown';
import classNames from 'classnames/bind';
import timelineStyles from './Timeline.module.css';

const cx = classNames.bind(timelineStyles);

const ItemWrapper = ({
  id,
  width,
  left,
  top,
  stopPropagationMouseDown,
  onResize,
  ItemComponent,
}) => {
  return (
    <div
      className={cx("timeline__item-wrapper")}
      style={{ width: `${width}px`, transform: `translate(${left}px, ${top}px)` }}
      onMouseDown={stopPropagationMouseDown}
    >
      <ReactResizeDetector
        handleHeight
        onResize={onResize}
        refreshMode="throttle"
        refreshRate={timelineThrottleWait}
        refreshOptions={{ 'leading': true, 'trailing': true }}
      />
      <ItemComponent id={id} />
    </div >
  );
};

const ItemWrapperMemo = React.memo(ItemWrapper);

const ItemWrapperConnect = ({
  id
}) => {
  const ItemComponent = useContext(ItemComponentContext);
  const item = useItem(id);
  const { start, end } = item;
  const scheduleElementXFunc = useScheduleElementXFunc();
  const left = scheduleElementXFunc(start);
  const width = scheduleElementXFunc(end) - left;
  const [top] = useItemTopHeight(id);

  const dispatch = useContext(TimelineDispatchContext);
  const onResize = useCallback(
    (_width, height) => {
      dispatch(setItemHeight(id, height));
    },
    [dispatch, id]
  );

  return (
    <ItemWrapperMemo
      id={id}
      width={width}
      left={left}
      top={top}
      stopPropagationMouseDown={stopPropagationMouseDown}
      onResize={onResize}
      ItemComponent={ItemComponent}
    />
  );
};

export default ItemWrapperConnect;