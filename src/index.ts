import Splide from '@splidejs/splide';

const btnParse = document.getElementById('actionParse');
const btnTryAgain = document.getElementById('actionTruAgain');
const inputField = document.getElementById('inputField');
const resultField = document.getElementById('resultField');

const switchActiveBtn = (activeBtn: HTMLButtonElement, deactivateBtn: HTMLButtonElement) => {
  activeBtn.disabled = false;
  deactivateBtn.disabled = true;
}

const switchView = (showField: HTMLElement, hideField: HTMLElement) => {
  showField.hidden = false;
  hideField.hidden = true;
}

interface IPageDate {
  page: string,
  date: string,
  time: string,
  url: string,
};

interface IGroupParseDate {
  [key: string]: IPageDate[];
};

interface IParseDate {
  [key: string]: IGroupParseDate;
};

const sortFromPage = (arr: IPageDate[]): IPageDate[] => {
  const firstArr = [];
  const secArr = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].page === arr[i + 1]?.page) {
      secArr.push(arr[i + 1])
    } else {
      firstArr.push(arr[i])
    }
  }
  return [...firstArr, ...secArr];
}

const enumerationOfData = (obj:IParseDate): IParseDate => {
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i+=1) {
    const scenariosName = keys[i]
    const keysOfScenarios = Object.keys(obj[scenariosName]);
    for (let j = 0; j < keysOfScenarios.length; j+=1) {
      const keyOfDescription = Object.keys(obj[scenariosName])[0];
      obj[scenariosName][keyOfDescription] = sortFromPage(obj[scenariosName][keyOfDescription])
    }
  }

  return obj
}

const parseData = (): IParseDate => {
  const input = inputField as HTMLInputElement;
  const getArrayURLs = input.value.match(/https:.+\.png/g);
  const sortedScreenshots: IParseDate = {};

  for (let i = 0; i < getArrayURLs.length; i += 1) {
    const name = getArrayURLs[i].match(/test_screenshots\/(.+)\.ts/)[1];
    const description = getArrayURLs[i].match(/\%3E+(.+)_page.+/)[1].replace(/%2C/g, ',').trim();
    const time = getArrayURLs[i].match(/.+T(..\%3A..\%3A..).+/)[1];
    const date = getArrayURLs[i].match(/time_(.+)T/)[1];
    const page = getArrayURLs[i].match(/.+_page_(.+)_time.+/)[1];

    if (!sortedScreenshots[name]) {
      sortedScreenshots[name] = {};
    };

    if (!sortedScreenshots[name][decodeURI(description)]) {
      sortedScreenshots[name][decodeURI(description)] = [];
    };

    sortedScreenshots[name][decodeURI(description)].push({
      page,
      date,
      time: time.replace(/%3A/g, ':'),
      url: getArrayURLs[i],
    });
  }
  return enumerationOfData(sortedScreenshots);
}

const createStructureSplide = (obj: IGroupParseDate, el: HTMLElement) => {
  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i += 1) {
    // create container item
    const container = document.createElement('div');
    container.className = 'item';
    const description = document.createElement('div');
    description.className = 'title';
    description.innerHTML = keys[i];
    container.append(description);

    // create slider item
    const primarySlider = document.createElement('div');
    primarySlider.className = 'splide';
    const secondarySlider = document.createElement('div');
    secondarySlider.className = 'splide';

    const primary_splide__track = document.createElement('div');
    primary_splide__track.className = 'splide__track';
    const splide__track = document.createElement('div');
    splide__track.className = 'splide__track';

    const primary_splide__list = document.createElement('ul');
    primary_splide__list.className = 'splide__list';
    const splide__list = document.createElement('ul');
    splide__list.className = 'splide__list';

    const elementList = obj[keys[i]];
    for (let j = 0; j < elementList.length; j += 1) {
      const primary_splide__slide = document.createElement('li');
      primary_splide__slide.className = 'splide__slide';
      const splide__slide = document.createElement('li');
      splide__slide.className = 'splide__slide';

      const primary_image = document.createElement('img');
      primary_image.className = 'screenshot';
      const image = document.createElement('img');
      image.className = 'screenshot';
      const data_container = document.createElement('div');
      data_container.className = 'data_container';
      const page = document.createElement('div');
      page.className = 'page';
      const date = document.createElement('span');
      date.className = 'date';
      const time = document.createElement('span');
      time.className = 'time';

      primary_image.setAttribute('src', elementList[j].url);
      image.setAttribute('src', elementList[j].url);
      page.innerHTML = `Page: ${elementList[j].page}`;
      date.innerHTML = `Date: ${elementList[j].date}`;
      time.innerHTML = `Time: ${elementList[j].time}`;


      primary_splide__slide.append(primary_image);
      splide__slide.append(image);
      splide__slide.append(page);
      data_container.append(date)
      data_container.append(time)
      primary_splide__slide.append(data_container);

      primary_splide__list.append(primary_splide__slide);
      splide__list.append(splide__slide);
    }

    primary_splide__track.append(primary_splide__list);
    splide__track.append(splide__list);

    primarySlider.append(primary_splide__track);
    secondarySlider.append(splide__track);

    container.append(primarySlider);
    container.append(secondarySlider);

    el.append(container);

    // Splide
    const secondarySplide = new Splide(secondarySlider, {
      fixedWidth: 100,
      height: 60,
      gap: 10,
      cover: true,
      isNavigation: true,
      focus: 'center',
      pagination: false,
      breakpoints: {
        '600': {
          fixedWidth: 66,
          height: 40,
        }
      },
    }).mount();

    const primarySplide = new Splide(primarySlider, {
      type: 'fade',
      width: '800px',
      pagination: false,
      arrows: false,
      cover: false,
    }); // do not call mount() here.

    primarySplide.sync(secondarySplide).mount();
    document.addEventListener('', () => {
    })
  }
}

const renderResult = (obj: IParseDate) => {
  const namesOfScenarios = Object.keys(obj);
  for (let i = 0; i < namesOfScenarios.length; i += 1) {
    const key = namesOfScenarios[i];
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const btnCollapse = document.createElement('button');
    const group = obj[key];

    details.className = 'details';
    summary.className = 'summary';
    btnCollapse.className = 'actionCollapse';

    summary.innerHTML = key;
    btnCollapse.innerHTML = 'Collapse';
    btnCollapse.onclick = (e: any) => {
      details.open = false;
      const nextElement = document.getElementById(e.target.parentNode.id);
      nextElement.scrollIntoView();
    }
    details.id = key;
    details.append(summary);

    createStructureSplide(group, details)

    details.append(btnCollapse);
    resultField.append(details);
  };
}

btnParse.addEventListener('click', () => {
  switchActiveBtn(btnTryAgain as HTMLButtonElement, btnParse as HTMLButtonElement);
  switchView(resultField, inputField);
  renderResult(parseData())
  // console.log(parseData())
})

btnTryAgain.addEventListener('click', () => {
  switchActiveBtn(btnParse as HTMLButtonElement, btnTryAgain as HTMLButtonElement);
  switchView(inputField as HTMLInputElement, resultField);
  inputField['value'] = '';
  resultField.innerHTML = '';
})
