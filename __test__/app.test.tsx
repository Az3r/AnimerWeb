import React from 'react';
import { render } from '@testing-library/react';
import { Typography } from '@material-ui/core';

test('should App tree not changed', () => {
  const { container } = render(<Typography>Hello</Typography>);
  expect(container.firstChild).toMatchSnapshot();
});
