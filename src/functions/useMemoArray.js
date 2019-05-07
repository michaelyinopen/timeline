
import { useMemo } from 'react';
import memoizeOne from 'memoize-one';
import { arrayArgumentsEquivalentFn } from './arrayEquivalent';

const useMemoArray = array => {
  const memoFunc = useMemo(
    () => memoizeOne(a => a, arrayArgumentsEquivalentFn),
    []
  );
  const memoArray = memoFunc(array);
  return memoArray;
};

export default useMemoArray;