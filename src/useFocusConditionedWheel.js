import { useState, useCallback } from 'react';

// maybe option to focus zoom/ no need focus to zoom
const useFocusConditionedWheel = (containerRef, focusToZoom, onWheel) => {
  const [isFocus, setIsFocus] = useState(false);
  const tabIndex = focusToZoom ? 0 : undefined;

  const onFocusClick = useCallback(
    e => containerRef.current.focus(),
    [containerRef]
  );
  const onFocus = useCallback(
    () => { setIsFocus(true); },
    [setIsFocus]
  );
  const onBlur = useCallback(
    () => { setIsFocus(false); },
    [setIsFocus]
  );

  const onFocusConditionedWheel = !focusToZoom || isFocus ? onWheel : undefined;
  return [onFocusConditionedWheel, tabIndex, onFocusClick, onFocus, onBlur];
}

export default useFocusConditionedWheel;