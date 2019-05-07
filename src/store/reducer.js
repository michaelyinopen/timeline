import { combineReducers } from 'redux';
import createReducer from '../functions/createReducer';
import updateItem, { createOrUpdateItem } from '../functions/updateItem';
import {
  initializeTimeOptions,
  changeViewInterval,
  setScheduleWidth,
  createGroups,
  updateGroup,
  createItems,
  updateItem as updateItemAction,
  setItems,
  setItemHeight,
  setGroupHeight,
} from './actionTypes';

//#region timeOptions
const minTime = createReducer(
  null,
  {
    [initializeTimeOptions]: (_state, action) => action.minTime,
  }
);

const maxTime = createReducer(
  null,
  {
    [initializeTimeOptions]: (_state, action) => action.maxTime,
  }
);

const viewStartTime = createReducer(
  null,
  {
    [initializeTimeOptions]: (_state, action) => action.viewStartTime,
    [changeViewInterval]: (_state, action) => action.start,
  }
);

const viewEndTime = createReducer(
  null,
  {
    [initializeTimeOptions]: (_state, action) => action.viewEndTime,
    [changeViewInterval]: (_state, action) => action.end,
  }
);

const minViewDuration = createReducer( // milliseconds // sample 1 day
  null,
  {
    [initializeTimeOptions]: (_state, action) => action.minViewDuration,
  }
);

const maxViewDuration = createReducer( // milliseconds
  null,
  {
    [initializeTimeOptions]: (_state, action) => action.maxViewDuration,
  }
);
//#endregion timeOptions

//#region groups
export const groupInitialState = id => ({
  id,
  title: undefined,
  description: undefined
});

const group = id => createReducer(
  groupInitialState(id),
  {
    [createGroups]: (state, _action, group) => ({
      ...state,
      title: group.title,
      description: group.description
    }),
    [updateGroup]: (state, action) => ({
      ...state,
      title: action.group.title,
      description: action.group.description
    })
  }
);

const groupsInitialState = [];
const groups = createReducer(
  groupsInitialState,
  {
    [createGroups]: (state, action) => {
      const { groups: groupsFromAction } = action;
      const newGroups = groupsFromAction.map(p => group(p.id)(undefined, action, p));
      return [...state, ...newGroups];
    },
    [updateGroup]: updateItem(group),
  }
);
//#endregion

//#region items
export const itemInitialState = id => ({
  id,
  title: undefined,
  description: undefined,
  groupId: null,
  start: null,
  end: null
});

const item = id => createReducer(
  itemInitialState(id),
  {
    [createItems]: (state, _action, item) => ({
      ...state,
      title: item.title,
      description: item.description,
      groupId: item.groupId,
      start: item.start,
      end: item.end,
    }),
    [updateItemAction]: (state, action) => ({
      ...state,
      title: action.item.title,
      description: action.item.description,
      groupId: action.item.groupId,
      start: action.item.start,
      end: action.item.end,
    }),
    [setItems]: (state, _action, item) => ({
      ...state,
      title: item.title,
      description: item.description,
      groupId: item.groupId,
      start: item.start,
      end: item.end,
    }),
  }
);

const itemsInitialState = [];
const items = createReducer(
  itemsInitialState,
  {
    [createItems]: (state, action) => {
      const { items: itemsFromAction } = action;
      const newItems = itemsFromAction.map(i => item(i.id)(undefined, action, i));
      return [...state, ...newItems];
    },
    [updateItemAction]: updateItem(item),
    [setItems]: (_state, action) => {
      const { items: itemsFromAction } = action;
      const newItems = itemsFromAction.map(i => item(i.id)(undefined, action, i));
      return [...newItems];
    },
  }
);
//#endregion

//#region scheduleWidth
const scheduleWidthInitialState = null;
const scheduleWidth = createReducer( // store int, unit is px
  scheduleWidthInitialState,
  {
    [setScheduleWidth]: (_state, action) => action.width,
  }
);
//#endregion scheduleWidth

//#region group and item heights
const groupHeightInitialState = id => ({
  id,
  height: undefined, //px
});

const groupHeight = id => createReducer(
  groupHeightInitialState(id),
  {
    [setGroupHeight]: (state, action) => {
      return ({
        ...state,
        height: action.height
      });
    },
  }
);

const groupHeightsInitialState = [];
const groupHeights = createReducer(
  groupHeightsInitialState,
  {
    [setGroupHeight]: createOrUpdateItem(groupHeight)
  }
);

const itemHeightInitialState = id => ({
  id,
  height: undefined, //px
});

const itemHeight = id => createReducer(
  itemHeightInitialState(id),
  {
    [setItemHeight]: (state, action) => {
      return ({
        ...state,
        height: action.height
      });
    },
  }
);

const itemHeightsInitialState = [];
const itemHeights = createReducer(
  itemHeightsInitialState,
  {
    [setItemHeight]: createOrUpdateItem(itemHeight),
  }
);
//#endregion

export const bareTimelineReducer = combineReducers({
  minTime,
  maxTime,
  viewStartTime,
  viewEndTime,
  minViewDuration,
  maxViewDuration,

  scheduleWidth,
  groupHeights,
  itemHeights,
});

export const initBareState = timeOptions => {
  return ({
    ...timeOptions,
    scheduleWidth: scheduleWidthInitialState,
    groupHeights: groupHeightsInitialState,
    itemHeights: itemHeightsInitialState,
  })
};

const fullReducer = combineReducers({
  timelineState: bareTimelineReducer,
  groups,
  items,
});

// the mandatory states
// const timeOptions = {
//   minTime,
//   maxTime,
//   viewStartTime,
//   viewEndTime,
//   minViewDuration,
//   maxViewDuration
// };
export const init = ({
  timeOptions,
  groups: groupsArg = groupsInitialState,
  items: itemsArg = itemsInitialState,
}) => {
  return ({
    timelineState: initBareState(timeOptions),
    groups: groupsArg,
    items: itemsArg,
  })
};

const reducer = (state, action) => {
  switch (action.type) {
    case initializeTimeOptions:
      return init(action.timeOptions);
    default:
      return fullReducer(state, action);
  }
}

export default reducer;

//#region selectors
export const timelineStateSelector = state => {
  return state.timelineState;
};

export const timelineGroupsSelector = state => {
  return state.groups;
};

export const timelineItemsSelector = state => {
  return state.items;
};
//#endregion selectors