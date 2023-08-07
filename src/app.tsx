import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import {
  CircularProgress,
  ThemeProvider,
  Box,
  ThemeOptionsType,
  TypographyType,
  TypographyPropertiesType,
} from '@peculiar/react-components';
import { Sidebar, SidebarItem } from './components';
import { parseData, IParseDate } from './parser';
import { responseData } from './parser/text';
import * as s from './app.module.scss';

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
    setTimeout(() => { res(responseData); }, 200);
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
      <div className={s.root}>
        <div className={s.loading}>
          <CircularProgress
            color="primary"
            size="large"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={s.root}>
      <Sidebar>
        <nav>
          <ul>
            {Object.keys(data).map((testGroupName) => {
              const group = data[testGroupName];

              return (
                <SidebarItem
                  key={testGroupName}
                  title={testGroupName}
                  list={group}
                />
              );
            })}
          </ul>
        </nav>
      </Sidebar>
      <main className={s.main}>
        <Box
          component="header"
          background="gray-2"
          className={s.header}
        >
          header
        </Box>

        <div className={s.image_wrapper}>
          test
        </div>

        <Box
          background="gray-1"
          borderColor="gray-3"
          borderStyle="solid"
          borderPosition="top"
          borderWidth={1}
          className={s.footer_navigation}
        >
          test
        </Box>
      </main>
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
      path: '/test',
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
