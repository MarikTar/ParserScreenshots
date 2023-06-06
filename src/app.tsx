import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { CircularProgress, Typography, ThemeProvider } from '@peculiar/react-components';
import { parseData } from './parser';
import { responseData } from './parser/text';

export const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <div>
          <CircularProgress color="primary" />

          <Typography>
            Loading
          </Typography>
        </div>
      ),
    },
    {
      path: 'test',
      element: (
        <div className="root">
          <header className="app-header">
            Test
          </header>
        </div>
      ),
    },
  ]);

  console.log(parseData(responseData));

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
