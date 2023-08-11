import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import {
  CircularProgress,
  ThemeProvider,
  Box,
  ThemeOptionsType,
  TypographyType,
  TypographyPropertiesType,
  Typography,
  Image,
  IconButton,
  useMediaQuery,
} from '@peculiar/react-components';
import { useCarousel } from 'use-carousel-hook';
import {
  Sidebar,
  SidebarItem,
  Header,
  FooterNavigation,
} from './components';
import { parseData, IParseDate, IPageData } from './parser';
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
  const [loading, setLoading] = React.useState(false);
  const prepare = React.useRef<Record<string, IPageData[]>>({});
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigation = useNavigate();
  const hash = decodeURI(location.hash.substring(1));
  const resourceURL = searchParams.get('resource');
  const {
    ref,
    previous,
    next,
    setCurrent,
    current,
    position,
    reset,
  } = useCarousel<HTMLUListElement>();

  React.useEffect(() => {
    if (resourceURL) {
      setLoading(true);
      fetch(resourceURL)
        .then((response) => response.text())
        .then((responseData) => {
          const json = JSON.parse(responseData);
          const parsedData = parseData(json);

          Object.values(parsedData).forEach((testCases) => {
            Object.keys(testCases).forEach((testCaseName) => {
              prepare.current[testCaseName] = testCases[testCaseName];
            });
          });

          setData(parsedData);
        })
        .catch(console.warn)
        .finally(() => {
          setLoading(false);
          navigation(`#${Object.keys(prepare.current)[0]}`, { replace: true });
        });
    }
  }, [resourceURL]);

  React.useEffect(reset, [hash]);

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

  const currentData = prepare.current[hash];

  if (!data || !currentData) {
    return (
      <div className={s.root}>
        <div className={s.loading}>
          <Typography
            variant="s2"
            color="primary"
          >
            Ops, data was loose.
          </Typography>

          <Typography
            variant="b3"
          >
            Please contact the Backendych.
          </Typography>
        </div>
      </div>
    );
  }

  const renderSidebar = () => (
    <Sidebar>
      <ul>
        {Object.keys(data).map((testGroupName) => (
          <SidebarItem
            key={testGroupName}
            title={testGroupName}
            list={data[testGroupName]}
            currentHash={hash}
          />
        ))}
      </ul>
    </Sidebar>
  );

  return (
    <div className={s.root}>
      {!isMobile ? (
        <aside className={s.sidebar}>
          {renderSidebar()}
        </aside>
      ) : null}

      <main className={s.main}>
        <Header title={hash}>
          {renderSidebar()}
        </Header>

        <div className={s.image_wrapper} key={hash}>
          <Box
            component="label"
            htmlFor="prev"
            className={s.previous_button}
          >
            <IconButton
              id="prev"
              size="large"
              onClick={() => previous()}
              circled
              disabled={position.isAtStart}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="m14 18-6-6 6-6"
                />
              </svg>
            </IconButton>
          </Box>

          <Box
            component="ul"
            ref={ref}
            className={s.carousel_list}
            background="gray-1"
            borderRadius={4}
          >
            {currentData.map((item, index) => (
              <li
                className={s.carousel_item}
                // eslint-disable-next-line react/no-array-index-key
                key={`${item.url}-${index}`}
              >
                <figure className={s.carousel_item_figure}>
                  <Image
                    className={s.image}
                    src={item.url}
                    alt={item.time}
                  />
                </figure>
              </li>
            ))}
          </Box>

          <Box
            component="label"
            htmlFor="next"
            className={s.next_button}
          >
            <IconButton
              id="next"
              size="large"
              onClick={() => next()}
              circled
              disabled={position.isAtEnd}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="1.5"
                  d="m10 18 6-6-6-6"
                />
              </svg>
            </IconButton>
          </Box>
        </div>

        <div className={s.meta_data}>
          <Typography
            variant="s2"
          >
            {`Time: ${currentData[current].time}`}
          </Typography>

          <Typography
            variant="s2"
          >
            {`Date: ${currentData[current].date}`}
          </Typography>
        </div>

        <FooterNavigation
          pageData={currentData}
          currentNumber={current}
          onClick={setCurrent}
        />
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
  ]);

  return (
    <ThemeProvider theme={{ color: palette, text }}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
