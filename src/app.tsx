import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import {
  CircularProgress,
  Typography,
  ThemeProvider,
  Box,
  ThemeOptionsType,
  TypographyType,
  TypographyPropertiesType,
} from '@peculiar/react-components';
import { Sidebar } from './components';
import { parseData, IParseDate } from './parser';
import { responseData } from './parser/text';
// import s from './app.module.scss';

const palette: ThemeOptionsType['color'] = {
  primary: '#0049DB',
  secondary: '#00A4B5',
  wrong: '#EB3638',
  attention: '#F0B400',
  success: '#1CBA75',
  'extra-1': '#7B00FF',
};

const text: Partial<Record<TypographyType, TypographyPropertiesType>> = {
  h2: {
    weight: '800',
    size: '35px',
    height: '45px',
    spacing: '0.1px',
  },
  h1: {
    weight: '700',
    size: '70px',
    height: '90px',
    spacing: '0.1px',
  },
  h3: {
    weight: '800',
    size: '27px',
    height: '35px',
    spacing: '0.1px',
  },
};

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

    return (
      <Box
        key={Object.keys(group)[0]}
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
      <Sidebar />
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
    <ThemeProvider theme={{ color: palette, text }}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
