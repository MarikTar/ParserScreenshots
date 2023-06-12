export interface IPageDate {
  page: string,
  date: string,
  time: string,
  url: string,
}

interface IGroupParseDate {
  [key: string]: IPageDate[];
}

export interface IParseDate {
  [key: string]: IGroupParseDate;
}

const sortFromPage = (arr: IPageDate[]): IPageDate[] => {
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
  const result: IParseDate = {};

  Object.keys(obj).forEach((scenariosName) => {
    const scenarios = obj[scenariosName];
    const keysOfScenarios = Object.keys(scenarios);

    result[scenariosName] = {};

    keysOfScenarios.forEach(() => {
      const keyOfDescription = keysOfScenarios[0];

      result[scenariosName][keyOfDescription] = sortFromPage(scenarios[keyOfDescription]);
    });
  });

  return result;
};

export const parseData = (response: string[]): IParseDate => {
  const sortedScreenshots: IParseDate = {};

  response.forEach((url) => {
    const name = (url.match(/test_screenshots\/(.+)\.ts/)?.[1] || '').trim();
    // eslint-disable-next-line no-useless-escape
    const description = decodeURI((url.match(/\%3E+(.+)_page.+/)?.[1].replace(/%2C/g, ',') || '')).trim();
    // eslint-disable-next-line no-useless-escape
    const time = url.match(/.+T(..\%3A..\%3A..).+/)?.[1] || '';
    const date = url.match(/time_(.+)T/)?.[1] || '';
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
      url,
    });
  });

  return enumerationOfData(sortedScreenshots);
};
