import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@peculiar/react-components';
import { HotkeysProvider } from 'react-hotkeys-hook';
import { theme } from './constants';
import { ScreenshotsView } from './containers';

export const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <ScreenshotsView />,
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <HotkeysProvider>
        <RouterProvider router={router} />
      </HotkeysProvider>
    </ThemeProvider>
  );
};
