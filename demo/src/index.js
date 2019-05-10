import React from 'react';
import { render } from 'react-dom';
import UncontrolledExample from './UncontrolledExample';
import ControlledExample from './ControlledExample';
import '../css/index.css';

const TimelineDemo = () => {
  return (
    <div>
      <h1>@michaelyin/timeline Demo</h1>
      <UncontrolledExample />
      <ControlledExample />
    </div >
  );
}

render(<TimelineDemo />, document.querySelector('#demo'))
