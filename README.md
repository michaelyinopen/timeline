# @michaelyin/timeline

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

A React component that shows some events' time and duration on a time scale.

Visit the [Live Demo](https://michaelyinopen.github.io/timeline).

![uncontrolled example](images/uncontrolled-example.png)

## The Display
- Displays items according to their start and end time.
- Displays items in groups.
- Items with overlapping intervals will display in a stack.
- User can use mouse to pan along the timeline.
- User can scroll in and out to change time scale.

## Demos
### Live Demo: [Live Demo](https://michaelyinopen.github.io/timeline)
### Local Demo
```
git clone https://github.com/michaelyinopen/timeline.git
cd timeline
npm install && npm start
// or
yarn install && yarn start
```
## Create tgz (this project is not on npm)
```
npm pack
// OR
yarn pack
```
Creates a michaelyin-timeline-1.0.1.tgz
## Installation
```
npm i michaelyin-timeline-1.0.1.tgz
// OR
yarn add michaelyin-timeline-1.0.1.tgz
```

## Usage
```
import {
  Timeline,
  GroupAxis,
  TimelineContent,
  ScheduleContainer,
  TimeAxis
} from '@michaelyin/timeline';
...
const MyComponent = () => {
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
}
```
Use the timeline component and its children components as above.
The timeline will be rendered with the groups and items.

### Timeline Props
- `timeOptions` an object of
    ```javascript
    {
      minTime,           // javascript Date
      maxTime,           // javascript Date
      viewStartTime,     // javascript Date
      viewEndTime,       // javascript Date
      minViewDuration,   // milliseconds
      maxViewDuration,   // milliseconds
    }
    ```
- `groups` an **array** of object of
    ```javascript
    {
      id,            // unique identifier
      title,         // displayed on the group axis on the left
      description,   // tooltip of the group axis
    }
    ```
- `items` an **array** of object of
    ```javascript
    {
      id,       // unique identifier
      title,    // displayed on the item (optional if you set itemComponent prop)
      groupId,  // id of group
      start,    // javascript Date
      end,      // javascript Date
    }
    ```
- `itemComponent`(Optional) you can pass a custom react component to render the items. The component receives the item's `id` as prop.
See [Custom Render Item and Groups](wiki/custom-render-items-groups.md).
- `groupComponent`(Optional) you can pass a custom react component to render the group's area where items are placed. The component receives the group's `id` as prop. *This does not affect the group axis on the left.*
See [Custom Render Item and Groups](wiki/custom-render-items-groups.md).

*Note: `timeOptions`, `groups` and `items` props are used only to initialize the timeline. Updates to these props will not take effect, see [Controlled Timeline](wiki/controlled-timeline.md) if you want to update these props.*

*Note: other properties in `timeOptions`, `groups` and `items` objects are ignored.*

### ScheduleContainer Props
- `focusToZoom` By default, when mouse is over the timeline schedule, scrolling will zoom the view time. Set `focusToZoom` to prevent scroll zoom, unless the schedule is selected. Use this if documet scrolling is interrupted by timeline.

### TimeAxis Props
- `focusToZoom` By default, when mouse is over the time-axis, scrolling will zoom the view time. Set `focusToZoom` to prevent scroll zoom, unless the time axis is selected. Use this if documet scrolling is interrupted by timeline.

## Advanced Usage: Controlled Timeline
Other than providing a self-contained `Timeline` component, this library also provides a `ControlledTimeline` to facilitate integration with other parts of an application.
See [Controlled Timeline](wiki/controlled-timeline.md)

## Advanced Usage: Custom render of items and groups
The render of items and groups can be changed by setting `itemComponent` and/or `groupComponent` props on Timeline.
See [Custom Render Item and Groups](wiki/custom-render-items-groups.md).

## Contributing
see  [CONTRIBUTING](CONTRIBUTING.md)


[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo
