import { useEffect, useContext, useCallback } from 'react';
import { throttle } from 'lodash';
import { zoomfactor, timelineThrottleWait } from './constants';
import { changeViewInterval } from './store/actionCreators';
import TimelineDispatchContext from './TimelineDispatchContext';
import {
  useViewStartTime,
  useViewEndTime,
  useMinTime,
  useMaxTime,
  useScheduleWidth,
  useMinViewDuration,
  useMaxViewDuration,
} from './store/useSelector';
import { differenceInMilliseconds, addMilliseconds, subMilliseconds, isBefore, isAfter } from 'date-fns/fp';
import useHandlerCallback from './useHandlerCallback';

const useOnWheelZoom = containerRef => {
  const dispatch = useContext(TimelineDispatchContext);
  const width = useScheduleWidth();
  const viewStartTime = useViewStartTime();
  const viewEndTime = useViewEndTime();
  const minTime = useMinTime();
  const maxTime = useMaxTime();
  const minViewDuration = useMinViewDuration();
  const maxViewDuration = useMaxViewDuration();
  const viewDuration = differenceInMilliseconds(viewStartTime)(viewEndTime);

  const onWheelHandlerCallback = useHandlerCallback(
    (zoomSign, pageX) => {
      // zoomSign is 1(zoomIn), 0 or -1(zoomOut)
      const allowZoomIn = (zoomSign === 1 && viewDuration > minViewDuration);
      const allowZoomOut = (zoomSign === -1 && viewDuration < maxViewDuration);
      if (allowZoomIn || allowZoomOut) {
        const containerOffsetLeft = containerRef.current.offsetLeft;

        const zoomPointX = pageX - containerOffsetLeft;

        const zoomDate = addMilliseconds(zoomPointX / width * viewDuration)(viewStartTime);
        const appliedZoomFactor = Math.max(1, 1 - zoomSign * zoomfactor) / Math.max(1, 1 + zoomSign * zoomfactor);

        let newViewStart = subMilliseconds(differenceInMilliseconds(viewStartTime)(zoomDate) * appliedZoomFactor)(zoomDate);
        newViewStart = isBefore(minTime)(newViewStart) ? minTime : newViewStart;

        let newViewEnd = addMilliseconds(differenceInMilliseconds(zoomDate)(viewEndTime) * appliedZoomFactor)(zoomDate);
        newViewEnd = isAfter(maxTime)(newViewEnd) ? maxTime : newViewEnd;

        const newViewDuration = differenceInMilliseconds(newViewStart)(newViewEnd);
        if (newViewDuration > maxViewDuration) {
          newViewEnd = addMilliseconds(maxViewDuration)(newViewStart);
        }
        if (newViewDuration < minViewDuration) {
          newViewEnd = addMilliseconds(minViewDuration)(newViewStart);
        }

        dispatch(changeViewInterval({ start: newViewStart, end: newViewEnd }));
      }
    }
  );

  // have to create the real event handler because react synthetic event will not be available in next render.
  // here the preventDefault is called
  // also event properties are selected can cached
  // throttle the scroll because do not want smooth wheels to scroll uncontrollably fast
  // throttle: pre-mature solving a maybe-non-existing problem
  const onWheelthrottled = useCallback(
    throttle(
      (zoomSign, pageX) => onWheelHandlerCallback(zoomSign, pageX),
      timelineThrottleWait,
      { leading: true, trailing: true }
    ),
    [onWheelHandlerCallback]
  );

  const onWheel = useCallback(
    e => {
      let delta =
        e.deltaY ||
        e.delta ||
        (e.originalEvent && e.originalEvent.wheelDelta) ||
        (e.originalEvent && -e.originalEvent.detail); // browser compatibility
      const zoomSign = delta ? -Math.sign(delta) : 0;
      onWheelthrottled(zoomSign, e.pageX);
      e.preventDefault();
      e.stopPropagation();
    },
    [onWheelthrottled]
  );

  useEffect(() => {
    return () => {
      if (onWheelthrottled.cancel) onWheelthrottled.cancel();
    }
  }, [onWheelthrottled]);

  return onWheel;
};

export default useOnWheelZoom;