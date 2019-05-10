import React, { useReducer, useContext } from 'react';
import renderer from 'react-test-renderer';
import { combineReducers } from 'redux';
import {
  initBareState,
  bareTimelineReducer,
  TimelineStateContext,
  TimelineItemsStateContext,
  TimelineGroupsStateContext,
  TimelineDispatchContext,
  ControlledTimeline,
  GroupAxis,
  TimelineContent,
  ScheduleContainer,
  TimeAxis
} from './index';

describe("Controlled Timeline", () => {
  const timeOptions = {
    minTime: new Date(2019, 0, 1),
    maxTime: new Date(2019, 0, 1, 1),
    viewStartTime: new Date(2019, 0, 1),
    viewEndTime: new Date(2019, 0, 1, 1),
    minViewDuration: 1800000,
    maxViewDuration: 3600000
  };

  const venuesData = [
    { "id": 1, name: "Factory", address: "1, Inductrial Centre, Industry Street" },
    { "id": 2, name: "Main Branch", address: "Shop 1A, Big Shopping Mall, 1 Beautiful Avenue" },
    { "id": 3, name: "Office", address: "20/F, Tall Buiding, City Central" },
    { "id": 4, name: "Outlet", address: "No. 37, Side Road" }
  ];

  const eventsData = [
    { "id": 1, "name": "Training", "venueId": 1, "start": new Date(2019, 0, 1, 0, 0), "end": new Date(2019, 0, 1, 0, 10) },
    { "id": 2, "name": "QA inspect", "venueId": 2, "start": new Date(2019, 0, 1, 0, 0), "end": new Date(2019, 0, 1, 0, 8) },
    { "id": 3, "name": "QA inspect", "venueId": 1, "start": new Date(2019, 0, 1, 0, 10), "end": new Date(2019, 0, 1, 0, 13) },
    { "id": 4, "name": "Training", "venueId": 2, "start": new Date(2019, 0, 1, 0, 10), "end": new Date(2019, 0, 1, 0, 18) },
    { "id": 5, "name": "Boss visit", "venueId": 1, "start": new Date(2019, 0, 1, 0, 13), "end": new Date(2019, 0, 1, 0, 17) },
    { "id": 6, "name": "QA inspect", "venueId": 4, "start": new Date(2019, 0, 1, 0, 13), "end": new Date(2019, 0, 1, 0, 18) },
    { "id": 7, "name": "Boss visit", "venueId": 2, "start": new Date(2019, 0, 1, 0, 18), "end": new Date(2019, 0, 1, 0, 25) },
    { "id": 8, "name": "QA inspect", "venueId": 3, "start": new Date(2019, 0, 1, 0, 18), "end": new Date(2019, 0, 1, 0, 24) },
    { "id": 9, "name": "Training", "venueId": 3, "start": new Date(2019, 0, 1, 0, 24), "end": new Date(2019, 0, 1, 0, 28) },
    { "id": 10, "name": "Boss visit", "venueId": 4, "start": new Date(2019, 0, 1, 0, 25), "end": new Date(2019, 0, 1, 0, 28) },
  ];

  const EventsContext = React.createContext(null);

  const Event = ({ id }) => {
    const events = useContext(EventsContext);
    const event = events.find(e => e.id === id);
    return (
      <div
        style={{
          marginBottom: '4px',
          paddingTop: '5px',
          paddingBottom: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, transparent 10%, lightblue 15%, lightblue 85%, transparent 90%)'
        }}
      >
        {event.name}
      </div>
    );
  }

  //#region store
  //#region reducer
  // have events as timeline items, that have custom logic
  const eventsInitialState = [];
  const events = (state = eventsInitialState, _action) => {
    // for this example all events are created from the 'init' function
    // you can implement other actions and logic for events
    return state;
  };

  const venuesInitialState = [];
  const venues = (state = venuesInitialState, _action) => {
    // for this example all venues are created from the 'init' function
    // you can implement other actions and logic for events
    return state;
  };

  const reducer = combineReducers({
    timelineState: bareTimelineReducer,
    events,
    venues,
  });
  //#endregion reducer

  const init = ({
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

  // create a selector to select events
  const eventsStateSelector = state => state.events;

  // create a selector to select timeline properties
  const timelineStateSelector = state => state.timelineState;

  // create a selector to convert custom items(event in this example) to timeline item
  const timelineItemsSelector = state => {
    return state.events.map(e => ({ id: e.id, title: e.name, groupId: e.venueId, start: e.start, end: e.end }));
  };

  // create a selector to convert custom groups(event in this example) to timeline group
  const timelineGroupsSelector = state => {
    return state.venues.map(v => ({ id: v.id, title: v.name, description: v.address }));
  };
  //#endregion store

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
    const eventsState = eventsStateSelector(state);
    const timelineState = timelineStateSelector(state);
    const timelineGroups = timelineGroupsSelector(state);
    const timelineItems = timelineItemsSelector(state);

    return (
      <EventsContext.Provider value={eventsState}>
        <TimelineDispatchContext.Provider value={dispatch}>
          <TimelineStateContext.Provider value={timelineState}>
            <TimelineGroupsStateContext.Provider value={timelineGroups}>
              <TimelineItemsStateContext.Provider value={timelineItems}>
                <ControlledTimeline
                  itemComponent={Event}
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
      </EventsContext.Provider>
    );
  };

  const ControlledExample = () => {
    return (
      <EventsOnTimeline
        timeOptions={timeOptions}
        venues={venuesData}
        events={eventsData}
      />
    );
  };

  test('Can render demo timeline', () => {
    const component = renderer.create(
      <ControlledExample />
    );
  });

  test('Matches snapshot', () => {
    const component = renderer.create(
      <ControlledExample />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});