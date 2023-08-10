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
  Chip,
  Image,
  IconButton,
  useMediaQuery,
  Drawer,
} from '@peculiar/react-components';
import { useCarousel } from 'use-carousel-hook';
import { Sidebar, SidebarItem } from './components';
import { parseData, IParseDate, IPageDate } from './parser';
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

const getData = async (): Promise<string[]> => new Promise((res) => {
  setTimeout(() => { res(responseData); }, 2000);
});

const Content = () => {
  const [data, setData] = React.useState<IParseDate>({});
  const [loading, setLoading] = React.useState(false);
  const prepare = React.useRef<Record<string, IPageDate[]>>({});
  const [open, setOpen] = React.useState(false);
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
      getData()
        .then((response) => {
          const parsedData = parseData(response);

          Object.values(parsedData).forEach((testCases) => {
            Object.keys(testCases).forEach((testCaseName) => {
              prepare.current[testCaseName] = testCases[testCaseName];
            });
          });

          console.log(parsedData);
          setData(parsedData);
        })
        .catch(console.log)
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

  if (!data || !prepare.current[hash]) {
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
            Please contact the backendovich.
          </Typography>
        </div>
      </div>
    );
  }

  const renderSidebar = () => (
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
                currentHash={hash}
              />
            );
          })}
        </ul>
      </nav>
    </Sidebar>
  );

  return (
    <div className={s.root}>
      {!isMobile ? (
        <div className={s.sidebar}>
          {renderSidebar()}
        </div>
      ) : null}
      <main className={s.main}>
        <Box
          component="header"
          background="gray-2"
          className={s.header}
        >
          <Typography
            variant={isMobile ? 's2' : 'h5'}
          >
            {hash}
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                size="large"
                onClick={() => setOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path fill="currentColor" d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm5-15h8c.55 0 1 .45 1 1s-.45 1-1 1h-8c-.55 0-1-.45-1-1s.45-1 1-1Zm0 6h8c.55 0 1 .45 1 1s-.45 1-1 1h-8c-.55 0-1-.45-1-1s.45-1 1-1Zm0 6h8c.55 0 1 .45 1 1s-.45 1-1 1h-8c-.55 0-1-.45-1-1s.45-1 1-1Z" />
                </svg>
              </IconButton>

              <Drawer
                open={open}
                onClose={() => setOpen(false)}
                className={s.drawer}
              >
                {renderSidebar()}
              </Drawer>
            </>
          ) : null}
        </Box>

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
            {prepare.current[hash].map((item, index) => (
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
            {`Time: ${prepare.current[hash][current].time}`}
          </Typography>

          <Typography
            variant="s2"
          >
            {`Date: ${prepare.current[hash][current].date}`}
          </Typography>
        </div>

        <Box
          background="gray-1"
          borderColor="gray-3"
          borderStyle="solid"
          borderPosition="top"
          borderWidth={1}
          className={s.footer_navigation}
        >
          {prepare.current[hash].map((item, index) => {
            const isCurrent = index === current;

            return [
              index && !Number(item.page) ? (
                <Typography
                  key="divider"
                  variant="s2"
                  className={s.divider}
                >
                  Re-run
                </Typography>
              ) : null,
              (
                <Box
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${item.url}-${index}`}
                  component={Chip}
                  onClick={() => setCurrent(index)}
                  color={isCurrent ? 'secondary' : 'default'}
                  variant="outlined"
                  className={s.preview_item}
                  borderRadius={4}
                  borderWidth={1}
                >
                  <Box
                    borderRadius={4}
                    borderWidth={1}
                    borderColor="gray-4"
                    borderStyle="solid"
                    component={Image}
                    src={item.url}
                    alt={item.time}
                    className={s.preview_image}
                  />

                  <Typography
                    variant="c2"
                    className={s.preview_description}
                  >
                    {`Page: ${item.page}`}
                  </Typography>
                </Box>
              ),
            ];
          })}
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
  ]);

  return (
    <ThemeProvider theme={{ color: palette, text }}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
