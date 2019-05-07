import { useContext, useMemo } from 'react';
import TimeLineStateContext from '../TimelineStateContext';
import TimelineItemsStateContext from '../TimelineItemsStateContext';
import TimelineGroupsStateContext from '../TimelineGroupsStateContext';

export const useMinTime = () => {
  const state = useContext(TimeLineStateContext);
  return state.minTime;
};

export const useMaxTime = () => {
  const state = useContext(TimeLineStateContext);
  return state.maxTime;
};

export const useViewStartTime = () => {
  const state = useContext(TimeLineStateContext);
  return state.viewStartTime;
};

export const useViewEndTime = () => {
  const state = useContext(TimeLineStateContext);
  return state.viewEndTime;
};

export const useMinViewDuration = () => {
  const state = useContext(TimeLineStateContext);
  return state.minViewDuration;
};

export const useMaxViewDuration = () => {
  const state = useContext(TimeLineStateContext);
  return state.maxViewDuration;
};

export const useScheduleWidth = () => {
  const state = useContext(TimeLineStateContext);
  return state.scheduleWidth;
};

export const useGroupHeight = id => {
  const state = useContext(TimeLineStateContext);
  const groupHeight = useMemo(
    () => {
      const groupHeightNullable = state.groupHeights.find(i => i.id === id);
      return groupHeightNullable && groupHeightNullable.height
        ? groupHeightNullable.height
        : null;
    },
    [state.groupHeights]
  )
  return groupHeight;
};

export const useItemHeights = () => {
  const state = useContext(TimeLineStateContext);
  return state.itemHeights;
};

export const useGroupIds = () => {
  const groups = useContext(TimelineGroupsStateContext);
  const groupIds = groups.map(g => g.id);
  return groupIds;
};

export const useGroup = id => {
  const groups = useContext(TimelineGroupsStateContext);
  const group = useMemo(
    () => groups.find(g => g.id === id),
    [id, groups]
  );
  return group;
};

export const useItems = () => {
  const items = useContext(TimelineItemsStateContext);
  return items;
};

export const useItemIdsOfGroup = groupId => {
  const items = useContext(TimelineItemsStateContext);
  const itemIdsOfGroup = useMemo(
    () => items
      .filter(i => i.groupId === groupId)
      .sort((a, b) => a.start - b.start)//relys on sorting on a copied array, i.e. the filter() in previous line
      .map(i => i.id),
    [groupId, items]
  );
  return itemIdsOfGroup;
};

export const useItem = id => {
  const items = useContext(TimelineItemsStateContext);
  const item = useMemo(
    () => items.find(i => i.id === id),
    [id, items]
  );
  return item;
};