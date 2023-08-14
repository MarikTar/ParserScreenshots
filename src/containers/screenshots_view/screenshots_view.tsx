import React from 'react';
import {
  useLocation,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import {
  CircularProgress,
  Box,
  Typography,
  Image,
  IconButton,
  useMediaQuery,
} from '@peculiar/react-components';
import { useHotkeys } from 'react-hotkeys-hook';
import { useCarousel } from 'use-carousel-hook';
import {
  Sidebar,
  SidebarItem,
  Header,
  FooterNavigation,
} from '../../components';
import {
  parseData,
  IParseDate,
  IPageData,
} from '../../utils';
import { mediaQueries } from '../../constants';
import * as s from './screenshots_view.module.scss';

export const ScreenshotsView: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [testList, setTestList] = React.useState<IParseDate>({});
  const [testByName, setTestByName] = React.useState<Record<string, IPageData[]>>({});

  const isMobile = useMediaQuery(mediaQueries.TABLET);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const hash = decodeURI(location.hash.substring(1));
  const navigation = useNavigate();

  const resourceURL = searchParams.get('resource') || window.sessionStorage.getItem('resource');
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
      window.sessionStorage.setItem('resource', resourceURL);

      setLoading(true);
      fetch(resourceURL)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(`Code: ${response.status}`);
          }

          return response.text();
        })
        .then((responseData) => {
          const json = JSON.parse(responseData);
          const parsedData = parseData(json);

          const result: Record<string, IPageData[]> = {};

          Object.values(parsedData).forEach((testCases) => {
            Object.keys(testCases).forEach((testCaseName) => {
              result[testCaseName] = testCases[testCaseName];
            });
          });

          setTestByName(result);
          setTestList(parsedData);

          navigation(`#${Object.keys(result)[0]}`, { replace: true });
        })
        .catch(console.warn)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [resourceURL]);

  useHotkeys('left,right', (_, handler) => {
    if (ref.current) {
      switch (handler.keys[0]) {
        case 'left': {
          previous();
          break;
        }

        case 'right': {
          next();
          break;
        }

        default:
          break;
      }
    }
  });

  React.useEffect(reset, [testByName]);

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

  const currentTestCase = testByName[hash];

  if (!currentTestCase) {
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
        {Object.keys(testList).map((testGroupName) => (
          <SidebarItem
            key={testGroupName}
            title={testGroupName}
            list={testList[testGroupName]}
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
            {currentTestCase.map((item, index) => (
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
            {`Time: ${currentTestCase[current]?.time}`}
          </Typography>

          <Typography
            variant="s2"
          >
            {`Date: ${currentTestCase[current]?.date}`}
          </Typography>
        </div>

        <FooterNavigation
          pageData={currentTestCase}
          currentNumber={current}
          onClick={setCurrent}
        />
      </main>
    </div>
  );
};
