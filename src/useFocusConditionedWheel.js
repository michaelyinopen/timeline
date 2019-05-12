import { useEffect, useCallback } from 'react';

// maybe option to focus zoom/ no need focus to zoom
// need dom event to prevent document scroll when zooming
const useFocusConditionedWheel = (containerRef, focusToZoom, onWheel) => {
  const onFocusClick = useCallback(
    e => containerRef.current.focus(),
    [containerRef]
  );

  const attach = useCallback(() => {
    if (containerRef && containerRef.current) {
      containerRef.current.removeEventListener("wheel", onWheel);
      containerRef.current.addEventListener("wheel", onWheel);
    }
  }, [containerRef, onWheel]);

  const detach = useCallback(() => {
    if (containerRef && containerRef.current) {
      containerRef.current.removeEventListener("wheel", onWheel);
    }
  }, [containerRef, onWheel]);

  useEffect(
    () => {
      if (!focusToZoom) {
        attach();
      }
      return () => detach();
    },
    [focusToZoom, attach, detach]
  );

  const tabIndex = focusToZoom ? 0 : undefined;
  const onFocusClickResult = focusToZoom ? onFocusClick : undefined;
  const onFocusResult = focusToZoom ? attach : undefined;
  const onBlurResult = focusToZoom ? detach : undefined;

  return [tabIndex, onFocusClickResult, onFocusResult, onBlurResult];
}

export default useFocusConditionedWheel;