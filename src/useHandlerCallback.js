import { useLayoutEffect, useCallback, useState } from 'react';

// be careful that unmounting will cause error.
const useHandlerCallback = func => {
  const [argsArray, setArgsArray] = useState([]);
  const callback = useCallback(
    (...args) => {
      setArgsArray(prevArray => [...prevArray, args]);
    },
    [setArgsArray]
  );

  useLayoutEffect(
    () => {
      const length = argsArray.length;
      if (length !== 0) {
        func(...argsArray[length - 1]);
        setArgsArray(prevArray => prevArray.slice(0, -1));
      }
    },
    [argsArray, setArgsArray]
  );
  return callback;
};

export default useHandlerCallback;