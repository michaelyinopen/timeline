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
    ```
    // myCustomReducer.js

    import {
      initBareState,
      bareTimelineReducer,
    } from '@michaelyin/timeline';
    import { combineReducers } from 'redux';

    // define events reducer
    // define venues reducer
    ...

    export const reducer = combineReducers({
      timelineState: bareTimelineReducer,
      events,
      venues,
    });
    //#endregion reducer

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

    Refer to [Timeline Props](../README.md#markdown-header-timeline-props) for the structures.
    ```
    const timelineStateSelector = state => state.timelineState;

    const timelineItemsSelector = state => {
      return state.events.map(e => ({ id: e.id, title: e.name, groupId: e.venueId, start: e.start, end: e.end }));
    };

    const timelineGroupsSelector = state => {
      return state.venues.map(v => ({ id: v.id, title: v.name, description: v.address }));
    };
    ```

Use the timeline component and its children components as above.
The timeline will be rendered with the groups and items.
