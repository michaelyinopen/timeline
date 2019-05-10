import React from 'react';
import renderer from 'react-test-renderer';
import {
  Timeline,
  GroupAxis,
  TimelineContent,
  ScheduleContainer,
  TimeAxis
} from './index';

describe("Uncontrolled Timeline", () => {
  const timeOptions = {
    minTime: new Date(2019, 0, 1),
    maxTime: new Date(2019, 0, 1, 1),
    viewStartTime: new Date(2019, 0, 1),
    viewEndTime: new Date(2019, 0, 1, 1),
    minViewDuration: 1800000,
    maxViewDuration: 3600000
  };

  const groups = [
    { "id": 1, title: "M1", description: "Machine 1" },
    { "id": 2, title: "M2", description: "Machine 2" },
    { "id": 3, title: "M3", description: "Machine 3" },
    { "id": 4, title: "M4", description: "Machine 4" }
  ];

  const items = [
    { "id": 1, "title": "J1", "groupId": 1, "start": new Date(2019, 0, 1, 0, 0), "procedureId": 1, "end": new Date(2019, 0, 1, 0, 10) },
    { "id": 2, "title": "J2", "groupId": 2, "start": new Date(2019, 0, 1, 0, 0), "procedureId": 4, "end": new Date(2019, 0, 1, 0, 8) },
    { "id": 3, "title": "J2", "groupId": 1, "start": new Date(2019, 0, 1, 0, 10), "procedureId": 5, "end": new Date(2019, 0, 1, 0, 13) },
    { "id": 4, "title": "J1", "groupId": 2, "start": new Date(2019, 0, 1, 0, 10), "procedureId": 2, "end": new Date(2019, 0, 1, 0, 18) },
    { "id": 5, "title": "J3", "groupId": 1, "start": new Date(2019, 0, 1, 0, 13), "procedureId": 8, "end": new Date(2019, 0, 1, 0, 17) },
    { "id": 6, "title": "J2", "groupId": 4, "start": new Date(2019, 0, 1, 0, 13), "procedureId": 6, "end": new Date(2019, 0, 1, 0, 18) },
    { "id": 7, "title": "J3", "groupId": 2, "start": new Date(2019, 0, 1, 0, 18), "procedureId": 9, "end": new Date(2019, 0, 1, 0, 25) },
    { "id": 8, "title": "J2", "groupId": 3, "start": new Date(2019, 0, 1, 0, 18), "procedureId": 7, "end": new Date(2019, 0, 1, 0, 24) },
    { "id": 9, "title": "J1", "groupId": 3, "start": new Date(2019, 0, 1, 0, 24), "procedureId": 3, "end": new Date(2019, 0, 1, 0, 28) },
    { "id": 10, "title": "J3", "groupId": 4, "start": new Date(2019, 0, 1, 0, 25), "procedureId": 10, "end": new Date(2019, 0, 1, 0, 28) },
  ];

  const UncontrolledExample = () => {
    return (
      <Timeline
        timeOptions={timeOptions}
        groups={groups}
        items={items}
      >
        <TimelineContent>
          <GroupAxis />
          <ScheduleContainer focusToZoom />
        </TimelineContent>
        <TimeAxis />
      </Timeline>
    );
  };

  test('Can render demo timeline', () => {
    const component = renderer.create(
      <UncontrolledExample />
    );
  });

  test('Matches snapshot', () => {
    const component = renderer.create(
      <UncontrolledExample />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});