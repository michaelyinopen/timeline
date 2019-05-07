

export const arrayArgumentsEquivalentFn = (newArgs, lastArgs) => {
  return newArgs.length === lastArgs.length &&
    newArgs.every((newArg, index) => {
      const oldArg = lastArgs[index];
      if (Array.isArray(newArg) && Array.isArray(oldArg))
        return arrayEquivalent(newArg, oldArg);
      return newArg === oldArg;
    });
}

//equal length and same order's elements shallow equal
function arrayEquivalent(arr1, arr2){
  if (arr1.length !== arr2.length) return false;
  for (var i = 0, len = arr1.length; i < len; i++){
      if (arr1[i] !== arr2[i]){
          return false;
      }
  }
  return true;
}
export default arrayEquivalent;