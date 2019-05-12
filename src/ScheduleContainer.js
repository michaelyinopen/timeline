import React, { useMemo, useCallback, useContext } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { timelineThrottleWait } from './constants';
import GroupWrapper from './GroupWrapper';

import TimelineDispatchContext from './TimelineDispatchContext';
import { setScheduleWidth } from './store/actionCreators';

import { useGroupIds } from './store/useSelector';
import {
  useEntireScheduleWidth,
  useScheduleX,
} from './store/lengthTime';

import useOnMouseDownPan from './useOnMouseDownPan';
import useOnWheelZoom from './useOnWheelZoom';
import useFocusConditionedWheel from './useFocusConditionedWheel';

import classNames from 'classnames/bind';
import timelineStyles from '../css/Timeline.module.css';
import useMemoArray from './functions/useMemoArray';
const cx = classNames.bind(timelineStyles);

const TimelineGroups = ({ groupIds }) => {
  return (
    <ol className={cx({ "timeline__groups": true, "timeline__list--none-style": true })}>
      {groupIds.map(gId => <li key={gId}><GroupWrapper id={gId} /></li>)}
    </ol>
  );
};

const ScheduleSlice = ({
  entireSchedulerWidth,
  posX,
  onMouseDown,
  children
}) => {
  return (
    <div
      className={cx("timeline__schedule-slide")}
      style={{ width: entireSchedulerWidth, transform: `translate(${posX}px,0px)` }}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
};

const ScheduleContainer = ({
  containerRef,
  tabIndex,
  onFocusClick,
  onFocus,
  onBlur,
  onResize,
  children,
}) => {
  return (
    <div
      ref={containerRef}
      tabIndex={tabIndex}
      onClick={onFocusClick}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cx({ "timeline__slide-container": true, "timeline__schedule-container": true })}
    >
      <ReactResizeDetector
        handleWidth
        onResize={onResize}
        refreshMode="throttle"
        refreshRate={timelineThrottleWait}
        refreshOptions={{ 'leading': true, 'trailing': true }}
      />
      {children}
    </div>
  );
};

const ScheduleContainerMemo = React.memo(ScheduleContainer);

const ScheduleContainerConnect = ({
  focusToZoom
}) => {
  const containerRef = React.useRef(null);
  const entireSchedulerWidth = useEntireScheduleWidth();
  const groupIds = useGroupIds();
  const groupIdsMemo = useMemoArray(groupIds);
  const posX = useScheduleX();

  const onMouseDown = useOnMouseDownPan(containerRef);
  const onWheel = useOnWheelZoom(containerRef);

  const [
    tabIndex,
    onFocusClick,
    onFocus,
    onBlur
  ] = useFocusConditionedWheel(containerRef, focusToZoom, onWheel);

  const dispatch = useContext(TimelineDispatchContext);
  const onResize = useCallback(width => dispatch(setScheduleWidth(width)), [dispatch]);

  const timelineGroupsMemo = useMemo(
    () => <TimelineGroups groupIds={groupIdsMemo} />,
    [groupIdsMemo]
  );

  const scheduleSliceMemo = useMemo(
    () => (
      <ScheduleSlice
        entireSchedulerWidth={entireSchedulerWidth}
        posX={posX}
        onMouseDown={onMouseDown}
      >
        {timelineGroupsMemo}
      </ScheduleSlice>
    ),
    [
      entireSchedulerWidth,
      posX,
      onMouseDown,
      timelineGroupsMemo
    ]
  );

  return (
    <ScheduleContainerMemo
      containerRef={containerRef}
      tabIndex={tabIndex}
      onFocusClick={onFocusClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onResize={onResize}
    >
      {scheduleSliceMemo}
    </ScheduleContainerMemo>
  );
};

export default ScheduleContainerConnect;