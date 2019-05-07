import * as fromActionTypes from './actionTypes';

export const initializeTimeOptions = timeOptions => ({
  type: fromActionTypes.initializeTimeOptions,
  timeOptions
});

export const changeViewInterval = ({
  start,
  end
}) => ({
  type: fromActionTypes.changeViewInterval,
  start,
  end
});

export const createGroups = groups => ({ // id, title, description
  type: fromActionTypes.createGroups,
  groups
});

export const updateGroup = group => ({
  type: fromActionTypes.updateGroup,
  ...group
});

export const createItems = items => ({ // id, title, description, groupId, start, end
  type: fromActionTypes.createItems,
  items
});

export const updateItem = (id, item) => ({
  type: fromActionTypes.updateItem,
  id: id,
  item: item
});

export const setItems = items => ({
  type: fromActionTypes.setItems,
  items
});

export const setScheduleWidth = width => ({
  type: fromActionTypes.setScheduleWidth,
  width
});

export const setItemHeight = (id, height) => ({
  type: fromActionTypes.setItemHeight,
  id,
  height
});

export const setGroupHeight = (id, height) => ({
  type: fromActionTypes.setGroupHeight,
  id,
  height
});