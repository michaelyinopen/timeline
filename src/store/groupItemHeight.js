import { useMemo } from 'react';
import { useItems, useItem, useItemHeights } from './useSelector';
import {
  areIntervalsOverlapping
} from 'date-fns/fp';
import memoizeOne from 'memoize-one';
import { memoize, groupBy } from 'lodash';
import { minGroupHeight } from '../constants';
import { arrayArgumentsEquivalentFn } from '../functions/arrayEquivalent';

//#region itemHeightLevels
const calculateItemHeightLevels = (unsetItems, setItems = []) => {
  if (unsetItems.length === 0) {
    return [];
  }
  const [currentItem, ...restItems] = unsetItems.map(i => i.heightLevel ? i : { ...i, heightLevel: 0 });
  if (restItems.length === 0) {
    return [currentItem];
  }
  const areItemsOverlapping = a => b =>
    areIntervalsOverlapping({ start: a.start, end: a.end }, { start: b.start, end: b.end }) &&
    a.heightLevel === b.heightLevel;
  const isOverlappingWithCurrent = areItemsOverlapping(currentItem);

  // recursion to get new heightLevel, keep incrementing the item's heightLevel,
  // until it does not overlap with any setItems
  const getItemWithNewHeightLevel = (item, setItemToCompare = setItems) => {
    const higherItem = { ...item, heightLevel: item.heightLevel + 1 };
    const higherSetItems = setItemToCompare.filter(
      h => h.heightLevel >= higherItem.heightLevel
    );
    const isOverlappingWithHigherItem = areItemsOverlapping(higherItem);
    if (higherSetItems.some(h => isOverlappingWithHigherItem(h))) {
      return getItemWithNewHeightLevel(higherItem, higherSetItems);
    }
    return higherItem;
  };

  const restItemsWithoutOverlappingWithCurrent = restItems.map(
    r => (isOverlappingWithCurrent(r) ? getItemWithNewHeightLevel(r) : r)
  );
  const noOverlappingRestItems = calculateItemHeightLevels(
    restItemsWithoutOverlappingWithCurrent,
    [...setItems, currentItem]
  );
  return [currentItem, ...noOverlappingRestItems];
};

// memoizeOne for calculateItemHeightLevels of one Group
// memoize(lodash) for all memoizeCalculateItemHeightLevelsFn(s) of all groups
const getCalculateItemHeightLevelsFnOfGroup = groupId => { // groupId is the cache key
  const memoizeCalculateItemHeightLevelsFn = memoizeOne(calculateItemHeightLevels, arrayArgumentsEquivalentFn);
  return memoizeCalculateItemHeightLevelsFn;
}

const memoizeGetCalculateItemHeightLevelsOfGroup = memoize(getCalculateItemHeightLevelsFnOfGroup);

const getItemHeightLevelsOfGroup = (groupId, allItems) => {
  const itemsOfGroup = allItems
    .filter(i => i.groupId === groupId)
    .sort((a, b) => a.id - b.id);//relys on sorting on a copied array, i.e. the filter() in previous line
  const calculateItemHeightLevelsFn = memoizeGetCalculateItemHeightLevelsOfGroup(groupId);
  const itemHeightLevels = calculateItemHeightLevelsFn(itemsOfGroup);
  return itemHeightLevels;
}
//#endregion itemsHeightLevel

const getGroupHeightLevelMap = (itemHeightLevelsOfGroup, itemHeights) => {
  const itemsGroupedByHeightLevel = groupBy(itemHeightLevelsOfGroup, i => i.heightLevel);
  let groupHeightLevelMap = new Map();
  for (const heightLevel in itemsGroupedByHeightLevel) {
    if (itemsGroupedByHeightLevel.hasOwnProperty(heightLevel)) {
      const itemsOfHeightLevel = itemsGroupedByHeightLevel[heightLevel];
      const itemHeightsOfHeightLevel = itemsOfHeightLevel.map(i => {
        const itemHeight = itemHeights.find(ih => ih.id === i.id);
        if (!itemHeight) { return 0; }
        if (!itemHeight.height) { return 0; }
        return itemHeight.height;
      })
      const maxHeight = Math.max(...itemHeightsOfHeightLevel);
      groupHeightLevelMap.set(heightLevel, maxHeight);
    }
  }
  return groupHeightLevelMap;
}

export const useItemTopHeight = id => {
  const items = useItems();
  const itemHeights = useItemHeights();
  const item = useItem(id);
  const itemHeightLevelsOfGroup = useMemo(
    () => getItemHeightLevelsOfGroup(item.groupId, items),
    [item.groupId, items]
  );
  const groupHeightLevelMap = useMemo(
    () => getGroupHeightLevelMap(itemHeightLevelsOfGroup, itemHeights),
    [itemHeightLevelsOfGroup, itemHeights]
  );
  const itemTopHeightResult = useMemo(
    () => {
      const heightLevelItem = itemHeightLevelsOfGroup.find(i => i.id === id);
      const itemHeightLevel = heightLevelItem ? heightLevelItem.heightLevel : 0;
      let itemHeight = 0;
      let itemTop = 0;
      for (const [heightLevel, height] of groupHeightLevelMap) {
        if (heightLevel < itemHeightLevel) {
          itemTop = itemTop + height;
        }
        if (heightLevel === itemHeightLevel) {
          itemHeight = height
        }
      }
      return [itemTop, itemHeight];
    },
    [itemHeightLevelsOfGroup, groupHeightLevelMap]
  );
  return itemTopHeightResult
}

export const useGroupItemsHeight = groupId => {
  const items = useItems();
  const itemHeights = useItemHeights();
  const itemHeightLevelsOfGroup = useMemo(
    () => getItemHeightLevelsOfGroup(groupId, items),
    [groupId, items]
  );
  const groupHeightLevelMap = useMemo(
    () => getGroupHeightLevelMap(itemHeightLevelsOfGroup, itemHeights),
    [itemHeightLevelsOfGroup, itemHeights]
  );
  const groupItemsHeightResult = useMemo(
    () => {
      let groupItemsHeight = 0;
      for (const [_heightLevel, height] of groupHeightLevelMap) {
        groupItemsHeight = groupItemsHeight + height;
      }
      if (groupItemsHeight === 0) {
        groupItemsHeight = minGroupHeight;
      }
      return groupItemsHeight;
    },
    [itemHeightLevelsOfGroup, groupHeightLevelMap]
  );
  return groupItemsHeightResult;
};