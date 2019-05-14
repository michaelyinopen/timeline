# Controlled Timeline
Other than providing a `Timeline` component as a self-contained component, this library also provides a `ControlledTimeline` to facilitate integration with other parts of an application.

`Timeline` component contains its own redux store and contexts, in contrast `ControlledTimeline` does not contain its own redux store and contexts. The benefits of having the store and contexts outside of the component:

- Only one redux store.
- More control over the structure of the state.
- Can use reducer composition or reducer enhancers.
- Other parts of an application can access timeline's state and dispatch timeline's actions.
- See https://reactjs.org/docs/forms.html#controlled-components

## Example: Events in Venues
1. Incorporate timeline's store into your store, it will not contain groups and items.
    ```javascript
    // myCustomReducer.js
    import {
      initBareState,
      bareTimelineReducer,
    } from '@michaelyin/timeline';
    import { combineReducers } from 'redux';

    // define events reducer
    // define venues reducer
    ...

   const reducer = combineReducers({
      timelineState: bareTimelineReducer,
      events,
      venues,
    });

    export default reducer;

    export const init = ({
      timeOptions,
      venues = venuesInitialState,
      events = eventsInitialState,
    }) => {
      return ({
        timelineState: initBareState(timeOptions),
        venues: [...venues],
        events: [...events],
      })
    };
    ```
2. Create selectors for
   * timelineState (without times and groups);
   * timelineGroups; and
   * timelineItems

    Refer to [Timeline Props](../README.md#timeline-props) for the structures.
    ```javascript
    // selectors.js
    const timelineStateSelector = state => state.timelineState;

    const timelineItemsSelector = state => {
      return state.events.map(e => ({ id: e.id, title: e.name, groupId: e.venueId, start: e.start, end: e.end }));
    };

    const timelineGroupsSelector = state => {
      return state.venues.map(v => ({ id: v.id, title: v.name, description: v.address }));
    };
    ```
3. Use the reducer and wrap the ControlledTimeline in contexts
    ```javascript
    import React, { useReducer, useContext } from 'react';
    import {
      TimelineStateContext,
      TimelineItemsStateContext,
      TimelineGroupsStateContext,
      TimelineDispatchContext,
      ControlledTimeline,
      GroupAxis,
      TimelineContent,
      ScheduleContainer,
      TimeAxis
    } from '@michaelyin/timeline';
    import reducer, { init } 'myCustomReducer';
    import {
      timelineStateSelector,
      timelineItemsSelector, timelineGroupsSelector
    } from 'selectors';
    import reducer, { init } 'myCustomReducer';
    import CustomStateContext from 'CustomStateContext'; // for the 
    import CustomEvent from 'CustomEvent'; // custom component to render an itementire state

    const EventsOnTimeline = ({
      timeOptions,
      venues,
      events,
    }) => {
      const [state, dispatch] = useReducer(
        reducer,
        {
          timeOptions,
          venues,
          events,
        },
        init
      );
      const timelineState = timelineStateSelector(state);
      const timelineGroups = timelineGroupsSelector(state);
      const timelineItems = timelineItemsSelector(state);

      return (
        <CustomStateContext.Provider value={state}>
          <TimelineDispatchContext.Provider value={dispatch}>
            <TimelineStateContext.Provider value={timelineState}>
              <TimelineGroupsStateContext.Provider value={timelineGroups}>
                <TimelineItemsStateContext.Provider value={timelineItems}>
                  <ControlledTimeline
                    itemComponent={CustomEvent} // custom component
                  >
                    <TimelineContent>
                      <GroupAxis />
                      <ScheduleContainer />
                    </TimelineContent>
                    <TimeAxis />
                  </ControlledTimeline>
                </TimelineItemsStateContext.Provider>
              </TimelineGroupsStateContext.Provider>
            </TimelineStateContext.Provider>
          </TimelineDispatchContext.Provider>
        </CustomStateContext.Provider>
      );
    };
    ```
  Use the Contexts and ControlledTimeline component and its children components as above.

  Now when the state of groups and items are updated, the selectors will return updated timeline items and the timeline will reflect the change.
