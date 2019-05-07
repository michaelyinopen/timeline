import React from 'react';
import { format } from 'date-fns/fp';
import { tickMarkLevel, timeAxisLabelType } from './store/tickMark';
import classNames from 'classnames/bind';
import timelineStyles from './Timeline.module.css';

const cx = classNames.bind(timelineStyles);

const getCenterTranslateX = (
  translatePosX,
  scheduleWidth,
  timeLabelWidth
) => {
  const initialTranslateX = -timeLabelWidth / 2;
  let centerTranslateX = `${-timeLabelWidth / 2}px`;
  //right edge
  if (translatePosX + timeLabelWidth + initialTranslateX > scheduleWidth) {
    centerTranslateX = `${scheduleWidth - translatePosX - timeLabelWidth}px`;
  }
  //left edge
  if (-initialTranslateX > translatePosX) {
    centerTranslateX = `${-translatePosX}px`;
  }
  return centerTranslateX;
};

const TimeAxisTimeLabel = ({
  translatePosXFunc,
  scheduleWidth,
  timeLabelWidth,
  timeFormat,
  date,
}) => {
  const translatePosX = translatePosXFunc(date);
  const innerTranslateX = getCenterTranslateX(
    translatePosX,
    scheduleWidth,
    timeLabelWidth
  );
  return (
    <React.Fragment>
      <div className={cx("timeline__time-axis-label-dot")}
        style={{
          transform: `translateX(${translatePosX}px) translate(-50%, -50%)`
        }}
      />
      <div
        className={cx("timeline__time-axis-label-time-connection")}
        style={{
          transform: `translateX(${translatePosX}px) translateX(-50%)`
        }}
      />
      <div
        className={cx("timeline__time-axis-time-label")}
        style={{
          width: `${timeLabelWidth}px`,
          transform: `translateX(${translatePosX}px) translateX(${innerTranslateX})`
        }}
      >
        {format(timeFormat)(date)}
      </div>
    </React.Fragment>
  );
};

const TimeAxisTimeLabelMemo = React.memo(TimeAxisTimeLabel);

const getCenterDisplaySpaceTranslateX = (
  startTranslatePosX,
  endTranslatePosX,
  dayTextWidth,
  scheduleWidth,
  labelWidth
) => {
  const startX = Math.max(startTranslatePosX, 0);
  const endX = Math.min(scheduleWidth, endTranslatePosX);

  let innerTranslateX = -Math.min(startTranslatePosX, 0) + (endX - startX) / 2 - dayTextWidth / 2;
  innerTranslateX = Math.max(innerTranslateX, 0);
  innerTranslateX = Math.min(innerTranslateX, labelWidth - dayTextWidth);

  return innerTranslateX;
};

const TimeAxisDayLabel = ({
  translatePosXFunc,
  scheduleWidth,
  dateInterval,
}) => {
  const startTranslatePosX = translatePosXFunc(dateInterval.start);
  const endTranslatePosX = translatePosXFunc(dateInterval.end);
  const width = endTranslatePosX - startTranslatePosX;
  const dayTickMarkLevel = tickMarkLevel.get("1D");
  const dayTextWidth = dayTickMarkLevel.timeLabelWidth;
  const timeFormat = dayTickMarkLevel.timeFormat;
  const innerTranslateX = getCenterDisplaySpaceTranslateX(
    startTranslatePosX,
    endTranslatePosX,
    dayTextWidth,
    scheduleWidth,
    width,
  );
  return (
    <React.Fragment>
      <div
        className={cx("timeline__time-axis-day-label")}
        style={{
          width: `${width}px`,
          transform: `translateX(${startTranslatePosX}px)`
        }}
      >
        <div
          style={{
            position: "relative",
            width: `${dayTextWidth}px`,
            transform: `translateX(${innerTranslateX}px)`
          }}
        >
          {format(timeFormat)(dateInterval.start)}
        </div>
      </div>
    </React.Fragment>
  );
};

const TimeAxisDayLabelMemo = React.memo(TimeAxisDayLabel);

const TimeAxisLabel = ({
  translatePosXFunc,
  scheduleWidth,
  timeLabelWidth,
  timeFormat,
  type,
  date,
  dateInterval,
}) => {
  if (type === timeAxisLabelType.time) {
    return (
      <TimeAxisTimeLabelMemo
        translatePosXFunc={translatePosXFunc}
        scheduleWidth={scheduleWidth}
        timeLabelWidth={timeLabelWidth}
        timeFormat={timeFormat}
        date={date}
      />
    );
  }
  if (type === timeAxisLabelType.day) {
    return (
      <TimeAxisDayLabelMemo
        translatePosXFunc={translatePosXFunc}
        scheduleWidth={scheduleWidth}
        dateInterval={dateInterval}
      />
    );
  }
  return null;
}

export default TimeAxisLabel;