import React from 'react';
import MyComponent from './index.js';
import renderer from 'react-test-renderer';

test('Can create component', () => {
  const component = renderer.create(
    <MyComponent />,
  );
});