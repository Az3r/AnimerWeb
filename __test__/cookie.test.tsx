import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { CookiesProvider, useCookies } from 'react-cookie';
import { Button } from '@material-ui/core';

test('should resolve theme using cookie', () => {
  render(<TestComponent />);
  expect(screen.getByRole('button')).toHaveTextContent('light');

  // click button to change theme value in cookie
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveTextContent('dark');
});

function TestComponent() {
  const [cookies, setCookie] = useCookies(['theme']);
  return (
    <CookiesProvider>
      <Button onClick={() => setCookie('theme', 'dark')}>
        {cookies.theme === 'dark' ? 'dark' : 'light'}
      </Button>
    </CookiesProvider>
  );
}
