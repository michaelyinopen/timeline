import React, { useReducer } from 'react';
import ControlledTimeline from './ControlledTimeline';
import reducer, {
  init,
  timelineStateSelector,
  timelineItemsSelector,
  timelineGroupsSelector,
} from './store/reducer';

import TimelineDispatchContext from './TimelineDispatchContext';
import TimelineStateContext from './TimelineStateContext';
import TimelineGroupsStateContext from './TimelineGroupsStateContext';
import TimelineItemsStateContext from './TimelineItemsStateContext';

// grid, tracker
// sets displayTime
// sets TrackerTime
const Timeline = ({
  // need to add an option: "date"/"distance"
  timeOptions,
  groups,
  items,
  itemComponent,
  groupComponent,
  children
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    { timeOptions, groups, items },
    init
  );

  const timelineState = timelineStateSelector(state);
  const timelineGroups = timelineGroupsSelector(state);
  const timelineItems = timelineItemsSelector(state);
  return (
    <TimelineDispatchContext.Provider value={dispatch}>
      <TimelineStateContext.Provider value={timelineState}>
        <TimelineGroupsStateContext.Provider value={timelineGroups}>
          <TimelineItemsStateContext.Provider value={timelineItems}>
            <ControlledTimeline
              itemComponent={itemComponent}
              groupComponent={groupComponent}
            >
              {children}
            </ControlledTimeline>
          </TimelineItemsStateContext.Provider>
        </TimelineGroupsStateContext.Provider>
      </TimelineStateContext.Provider>
    </TimelineDispatchContext.Provider>
  );
};

export default Timeline;