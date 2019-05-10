
import { useState, useCallback, useContext, useEffect } from 'react';
import { throttle } from 'lodash';
import { timelineThrottleWait } from './constants';
import TimelineDispatchContext from './TimelineDispatchContext';
import { changeViewInterval } from './store/actionCreators';
import {
  useViewStartTime,
  useViewEndTime,
  useMinTime,
  useMaxTime,
  useScheduleWidth,
} from './store/useSelector';
import { useScheduleX } from './store/lengthTime'
import { differenceInMilliseconds, addMilliseconds, subMilliseconds, isBefore, isAfter } from 'date-fns/fp';
import useHandlerCallback from './useHandlerCallback';

const calculateNewViewInterval = (
  newPosX,
  width,
  viewDuration,
  minTime,
  maxTime
) => {
  const newViewStart = addMilliseconds(Math.round(-newPosX / width * viewDuration))(minTime);
  const newViewEnd = addMilliseconds(viewDuration)(newViewStart);

  if (isBefore(minTime)(newViewStart)) // if newViewStart is before minTime
    return [minTime, addMilliseconds(viewDuration)(minTime)];
  if (isAfter(maxTime)(newViewEnd))
    return [subMilliseconds(viewDuration)(maxTime), maxTime];
  return [newViewStart, newViewEnd];
};

const useOnMouseDownPan = containerRef => {
  const dispatch = useContext(TimelineDispatchContext);
  const width = useScheduleWidth();
  const viewStartTime = useViewStartTime();
  const viewEndTime = useViewEndTime();
  const minTime = useMinTime();
  const maxTime = useMaxTime();
  const posX = useScheduleX();
  const viewDuration = differenceInMilliseconds(viewStartTime)(viewEndTime);

  const [mouseDownDragData, setMouseDownDragData] = useState({
    posX: undefined,
    pageX: undefined
  });
  const [isDragging, setIsDragging] = useState(false);
  const onMouseMoveHandlerCallback = useHandlerCallback(pageX => {
    if (isDragging) {
      const deltaX = mouseDownDragData.pageX - pageX;
      const newPosX = mouseDownDragData.posX - deltaX;

      const [newViewStart, newViewEnd] = calculateNewViewInterval(newPosX, width, viewDuration, minTime, maxTime);
      dispatch(changeViewInterval({ start: newViewStart, end: newViewEnd }));
    }
  });

  const onMouseMove = useCallback(
    throttle(
      e => {
        onMouseMoveHandlerCallback(e.pageX)
      },
      timelineThrottleWait,
      { leading: true, trailing: true }
    ),
    [onMouseMoveHandlerCallback]
  );

  useEffect(() => {
    return () => onMouseMove.cancel();
  }, []);

  const onMouseUp = useCallback(
    () => {
      setIsDragging(false);
      containerRef.current.style.cursor = "auto";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    },
    [setIsDragging]
  );

  const onMouseDownHandlerCallback = useHandlerCallback(pageX => {
    setMouseDownDragData({
      posX,
      pageX
    });
    setIsDragging(true);
  });
  const onMouseDown = useCallback(
    e => {
      containerRef.current.style.cursor = "grabbing";
      onMouseDownHandlerCallback(e.pageX);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [onMouseDownHandlerCallback]
  );
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.style.cursor = "auto";
      }
      if (onMouseMove.cancel) { onMouseMove.cancel(); }
      if (onMouseUp.cancel) { onMouseUp.cancel(); }
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return onMouseDown;
};

export default useOnMouseDownPan;