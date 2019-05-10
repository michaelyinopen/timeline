import { useMemo } from 'react';
import {
  useScheduleWidth,
  useMinTime,
  useMaxTime,
  useViewStartTime,
  useViewEndTime,
} from './useSelector';
import {
  differenceInMilliseconds,
  addMilliseconds,
  isAfter,
} from 'date-fns/fp';

export const useEntireScheduleWidth = () => {
  const schedulerWidth = useScheduleWidth();
  const minTime = useMinTime();
  const maxTime = useMaxTime();
  const viewStartTime = useViewStartTime();
  const viewEndTime = useViewEndTime();

  const getMillisecondsFromMinTime = differenceInMilliseconds(minTime);
  const entireDuration = getMillisecondsFromMinTime(maxTime);

  const viewDuration = differenceInMilliseconds(viewStartTime)(viewEndTime);
  const entireSchedulerWidth = entireDuration / viewDuration * schedulerWidth;
  return entireSchedulerWidth
};

export const useScheduleX = () => {
  const minTime = useMinTime();
  const viewStartTime = useViewStartTime();
  const viewEndTime = useViewEndTime();
  const scheduleWidth = useScheduleWidth();

  const getMillisecondsFromMinTime = differenceInMilliseconds(minTime);

  const viewDuration = differenceInMilliseconds(viewStartTime)(viewEndTime);

  const posX = scheduleWidth / viewDuration * -getMillisecondsFromMinTime(viewStartTime);
  return posX;
};

//#region conversions
export const useDurationToLengthFunc = () => {
  const viewStart = useViewStartTime();
  const viewEnd = useViewEndTime();
  const scheduleWidth = useScheduleWidth();
  const duration = differenceInMilliseconds(viewStart)(viewEnd);
  const durationToLengthFunc = useMemo(
    () => milliseconds => {
      const length = milliseconds / duration * scheduleWidth;
      return length;
    },
    [duration, scheduleWidth]
  );
  return durationToLengthFunc;
};

export const useLeftToTimeFunc = () => {
  const minTime = useMinTime();
  const maxTime = useMaxTime();
  const entireScheduleWidth = useEntireScheduleWidth();

  const leftToTimeFunc = useMemo(
    () => elementLeftX => {
      const getMillisecondsFromMinTime = differenceInMilliseconds(minTime);
      const entireDuration = getMillisecondsFromMinTime(maxTime);

      const millisecondsFrommMinTime = Math.max(elementLeftX / entireScheduleWidth * entireDuration, 0);

      let time = addMilliseconds(millisecondsFrommMinTime)(minTime);
      if (isAfter(maxTime)(time)) {
        time = maxTime;
      }
      return time;
    },
    [minTime, maxTime, entireScheduleWidth]
  )
  return leftToTimeFunc;
};

export const useScheduleElementXFunc = () => {
  const minTime = useMinTime();
  const maxTime = useMaxTime();
  const entireScheduleWidth = useEntireScheduleWidth();

  const scheduleElementXfunc = useMemo(
    () => time => {
      const getMillisecondsFromMinTime = differenceInMilliseconds(minTime);
      const entireDuration = getMillisecondsFromMinTime(maxTime);

      const x = getMillisecondsFromMinTime(time) / entireDuration * entireScheduleWidth;
      return x;
    },
    [minTime, maxTime, entireScheduleWidth]
  )
  return scheduleElementXfunc;
};
//#endregion conversions