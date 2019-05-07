import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns/fp';
import TimeAxisLabel from './TimeAxisLabel';
import useMemoArray from './functions/useMemoArray';

import { useScheduleWidth } from './store/useSelector';
import {
  useScheduleX,
  useEntireScheduleWidth,
  useScheduleElementXFunc,
} from './store/lengthTime';
import {
  tickMarkType,
  useTickMarkLevelSettings,
  useTimeAxisLabelPositions,
  useAllTickMarkPositions
} from './store/tickMark';
import { majorTickMarkHeight, minorTickMarkHeight } from './constants';

import useOnMouseDownPanViewInterval from './useOnMouseDownPanViewInterval';
import useOnWheelZoomViewInterval from './useOnWheelZoomViewInterval';
import useFocusConditionedWheel from './useFocusConditionedWheel';

import classNames from 'classnames/bind';
import timelineStyles from './Timeline.module.css';

const cx = classNames.bind(timelineStyles);

// Future: has labels for elements, ranges, markers
const TimeAxisSvg = ({
  allTickMarkPositions,
  scheduleElementXFunc,
  timeFormat
}) => {
  return (
    <svg className={cx("timeline__time-axis-svg")}>
      <line className={cx("timeline__time-axis-line")} x1="0%" x2="100%" y1="0" y2="0" />
      {allTickMarkPositions.map(mp => (<line
        key={mp.key}
        className={cx({
          "timeline__major-tick-mark": mp.type === tickMarkType.major,
          "timeline__minor-tick-mark": mp.type === tickMarkType.minor,
        })}
        x1={`${scheduleElementXFunc(mp.date)}px`}
        x2={`${scheduleElementXFunc(mp.date)}px`}
        y1="0"
        y2={mp.type === tickMarkType.major ? majorTickMarkHeight : minorTickMarkHeight}
      />))}
      {allTickMarkPositions.filter(mp => mp.type === tickMarkType.major).map(mp => (
        <text
          key={mp.key}
          fill="black"
          alignmentBaseline="hanging"
          x={`${scheduleElementXFunc(mp.date)}px`}
          dx="2px"
          dy="2px"
        >{format(timeFormat)(mp.date)}</text>))
      }
    </svg>
  );
};

const TimeAxisLabels = ({
  timeAxisLabelPositions,
  translatePosXFunc,
  timeFormat,
  timeLabelWidth,
  scheduleWidth,
}) => {
  return (
    <ol className={cx({ "timeline__time-axis-labels": true, "timeline__list--none-style": true })}>
      {timeAxisLabelPositions.map(mp => (
        <li key={mp.key}>
          <TimeAxisLabel
            translatePosXFunc={translatePosXFunc}
            scheduleWidth={scheduleWidth}
            timeLabelWidth={timeLabelWidth}
            timeFormat={timeFormat}
            type={mp.type}
            date={mp.date}
            dateInterval={mp.dateInterval}
          />
        </li>
      ))}
    </ol>
  );
};

const TimeAxis = ({
  containerRef,
  timeAxisSvg,
  timeAxisLabels,
  entireScheduleWidth,
  onMouseDown,
  tabIndex,
  onFocusClick,
  onFocus,
  onBlur,
  onFocusConditionedWheel,
  posX,
}) => {
  return (
    <div
      ref={containerRef}
      tabIndex={tabIndex}
      onClick={onFocusClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onWheel={onFocusConditionedWheel}
      className={cx({
        "timeline__time-axis": true,
        "timeline__slide-container": true
      })}
    >
      <div
        className={cx("timeline__time-axis-slide")}
        style={{ width: entireScheduleWidth, transform: `translate(${posX}px,0px)` }}
        onMouseDown={onMouseDown}
      >
        {timeAxisSvg}
      </div>
      {timeAxisLabels}
    </div >
  );
};

const TimeAxisMemo = React.memo(TimeAxis);

const TimeAxisConnect = ({
  showDay,
  focusToZoom,
}) => {
  const containerRef = React.useRef(null);
  const entireScheduleWidth = useEntireScheduleWidth();
  const onMouseDown = useOnMouseDownPanViewInterval(containerRef);
  const onWheel = useOnWheelZoomViewInterval(containerRef);
  const [
    onFocusConditionedWheel,
    tabIndex,
    onFocusClick,
    onFocus,
    onBlur
  ] = useFocusConditionedWheel(containerRef, focusToZoom, onWheel);
  const posX = useScheduleX();

  const allTickMarkPositions = useAllTickMarkPositions();
  const allTickMarkPositionKeysMemo = useMemoArray(allTickMarkPositions.map(p => p.key));
  // return memoized allTickMarkPositions if keys were unchanged
  const allTickMarkPositionsMemo = useMemo(
    () => allTickMarkPositions,
    [allTickMarkPositionKeysMemo]
  );
  const timeAxisLabelPositions = useTimeAxisLabelPositions(showDay);
  const timeAxisLabelPositionKeysMemo = useMemoArray(timeAxisLabelPositions.map(p => p.key));
  // return memoized timeAxisLabelPositions if keys were unchanged
  const timeAxisLabelPositionsMemo = useMemo(
    () => timeAxisLabelPositions,
    [timeAxisLabelPositionKeysMemo]
  );
  const scheduleElementXFunc = useScheduleElementXFunc();
  const translatePosXFunc = useCallback(
    date => scheduleElementXFunc(date) + posX,
    [scheduleElementXFunc, posX]
  );

  const { timeFormat, timeLabelWidth } = useTickMarkLevelSettings();
  const scheduleWidth = useScheduleWidth();

  const timeAxisSvgMemo = useMemo(
    () => (
      <TimeAxisSvg
        allTickMarkPositions={allTickMarkPositionsMemo}
        scheduleElementXFunc={scheduleElementXFunc}
        timeFormat={timeFormat}
      />
    ),
    [
      allTickMarkPositionsMemo,
      scheduleElementXFunc,
      timeFormat
    ]
  );
  const timeAxisLabelsMemo = useMemo(
    () => (
      <TimeAxisLabels
        timeAxisLabelPositions={timeAxisLabelPositionsMemo}
        translatePosXFunc={translatePosXFunc}
        timeFormat={timeFormat}
        timeLabelWidth={timeLabelWidth}
        scheduleWidth={scheduleWidth}
      />
    ),
    [
      timeAxisLabelPositionsMemo,
      translatePosXFunc,
      timeFormat,
      timeLabelWidth,
      scheduleWidth
    ]
  );
  return (
    <TimeAxisMemo
      containerRef={containerRef}
      timeAxisSvg={timeAxisSvgMemo}
      timeAxisLabels={timeAxisLabelsMemo}
      entireScheduleWidth={entireScheduleWidth}
      onMouseDown={onMouseDown}
      tabIndex={tabIndex}
      onFocusClick={onFocusClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onFocusConditionedWheel={onFocusConditionedWheel}
      posX={posX}
    />
  );
};


export default TimeAxisConnect;