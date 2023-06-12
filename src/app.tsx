import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import {
  CircularProgress, Typography, ThemeProvider, Box,
} from '@peculiar/react-components';
import { parseData, IParseDate } from './parser';
import { responseData } from './parser/text';

const Content = () => {
  const [data, setData] = React.useState<IParseDate>({});
  const [loading, setLoading] = React.useState(true);

  const getData = async (): Promise<string[]> => new Promise((res) => {
    setTimeout(() => { res(responseData); }, 100);
  });

  React.useEffect(() => {
    getData()
      .then((response) => {
        console.log(parseData(response));
        setData(parseData(response));
      })
      .catch(console.log)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div>
        <CircularProgress color="primary" />

        <Typography>
          Loading
        </Typography>
      </div>
    );
  }

  const renderContent = () => Object.keys(data).map((testNumber) => {
    const group = data[testNumber];

    console.log({ group, data });

    return (
      <Box
        borderColor="gray-9"
        borderStyle="solid"
        borderWidth={1}
      >
        <Typography>
          {testNumber}
        </Typography>
      </Box>
    );
  });

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (<Content />),
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

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
