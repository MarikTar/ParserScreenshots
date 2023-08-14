export interface IPageData {
  page: string,
  date: string,
  time: string,
  url: string,
}

export interface IGroupParseDate {
  [key: string]: IPageData[];
}

export interface IParseDate {
  [key: string]: IGroupParseDate;
}

const sortFromPage = (arr: IPageData[]): IPageData[] => {
  const firstArr = [];
  const secArr = [];

  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].page === arr[i + 1]?.page) {
      secArr.push(arr[i + 1]);
    } else {
      firstArr.push(arr[i]);
    }
  }
  return [...firstArr, ...secArr];
};

const enumerationOfData = (obj: IParseDate): IParseDate => {
  Object.keys(obj).forEach((scenariosName) => {
    const scenarios = obj[scenariosName];
    const keysOfScenarios = Object.keys(scenarios);

    keysOfScenarios.forEach(() => {
      const keyOfDescription = keysOfScenarios[0];

      // eslint-disable-next-line no-param-reassign
      obj[scenariosName][keyOfDescription] = sortFromPage(scenarios[keyOfDescription]);
    });
  });

  return obj;
};

export const parseData = (response: string[]): IParseDate => {
  const sortedScreenshots: IParseDate = {};

  response.forEach((url) => {
    const name = (url.match(/test_screenshots\/(.+)\.ts/)?.[1] || '').trim();
    // eslint-disable-next-line no-useless-escape
    const description = decodeURI((url.match(/\%3E+(.+)_page.+/)?.[1].replace(/%2C/g, ',') || '')).trim();
    // eslint-disable-next-line no-useless-escape
    const time = url.match(/.+T(..\%3A..\%3A..).+/)?.[1] || '';
    const date = url.match(/time_(....-..-..)T/)?.[1] || '';
    const page = url.match(/.+_page_(.+)_time.+/)?.[1] || '';

    if (!sortedScreenshots[name]) {
      sortedScreenshots[name] = {};
    }

    if (!sortedScreenshots[name][description]) {
      sortedScreenshots[name][description] = [];
    }

    sortedScreenshots[name][description].push({
      page,
      date,
      time: time.replace(/%3A/g, ':'),
      url: url.match(/https:.+\.png/g).toString() || '',
    });
  });

  return enumerationOfData(sortedScreenshots);
};
