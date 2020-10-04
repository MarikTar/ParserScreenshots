// import { Splide } from '@splidejs/splide';

// new Splide( '.splide' ).mount();

const btnParse = document.getElementById('actionParse');
const btnTryAgain = document.getElementById('actionTruAgain');
const inputField = document.getElementById('inputField');
const resultField = document.getElementById('resultField');

const switchActiveBtn = (activeBtn, deactivateBtn) => {
  activeBtn.disabled = false;
  deactivateBtn.disabled = true;
}

const switchView = (showField, hideField) => {
  showField.hidden = false;
  hideField.hidden = true;
}

const parseData = () => {
  const getArrayURLs = inputField.value.match(/https:.+\.png/g);
  const sortedScreenshots = {};

  for (let i = 0; i < getArrayURLs.length; i += 1) {
    const name = getArrayURLs[i].match(/test_screenshots\/(.+)\.ts/)[1];
    const description = getArrayURLs[i].match(/\%3E+(.+)_page.+/)[1];
    const time = getArrayURLs[i].match(/.+T(..\%3A..\%3A..).+/)[1];
    const date = getArrayURLs[i].match(/time_(.+)T/)[1];
    const page = getArrayURLs[i].match(/.+_page_(.+)_time.+/)[1];

    if (!sortedScreenshots[name]) {
      sortedScreenshots[name] = [];
    };

    sortedScreenshots[name].push({
      page,
      date,
      time: time.replace(/%3A/g, ':'),
      description: decodeURI(description).replace(/%2C/g, ','), 
      url: getArrayURLs[i],
    });
  }
  return sortedScreenshots;
}

const renderResult = (obj) => {
  for (key in obj) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const btnCollapse = document.createElement('button');
    const group = obj[key]

    details.className = 'details';
    summary.className = 'summary';
    btnCollapse.className = 'actionCollapse';

    summary.innerHTML = key;
    btnCollapse.innerHTML = 'Collapse';
    btnCollapse.onclick = (e) => {
      details.open = false;
      const nextElement = document.getElementById(e.target.parentNode.id);
      nextElement.scrollIntoView();
    }
    details.id = key;
    details.append(summary);

    for (let i = 0; i < group.length; i += 1) {
      const container = document.createElement('div');
      const descriptionContainer = document.createElement('div');
      const description = document.createElement('span');
      const dateContainer = document.createElement('span');
      const page = document.createElement('span');
      const date = document.createElement('div');
      const time = document.createElement('div');
      const image = document.createElement('img');

      descriptionContainer.className = 'description_container';
      container.className = 'item';
      description.className = 'title';
      image.className = 'screenshot';
      dateContainer.className = 'date_container';
      page.className = 'page';
      date.className = 'date';
      time.className = 'time';

      description.innerHTML = group[i].description;
      date.innerHTML = `Date: ${group[i].date}`;
      time.innerHTML = `Time: ${group[i].time}`;
      page.innerHTML = `Page: ${group[i].page}`;
      dateContainer.append(date);
      dateContainer.append(time);
      descriptionContainer.append(description);
      descriptionContainer.append(page);
      descriptionContainer.append(dateContainer);
      container.append(descriptionContainer);
      image.setAttribute('src', group[i].url);
      container.append(image);

      details.append(container);
    }

    details.append(btnCollapse);
    resultField.append(details);
  }
}

btnParse.addEventListener('click', () => {
  switchActiveBtn(btnTryAgain, btnParse);
  switchView(resultField, inputField);
  renderResult(parseData())
  console.log(parseData())
})

btnTryAgain.addEventListener('click', () => {
  switchActiveBtn(btnParse, btnTryAgain);
  switchView(inputField, resultField);
  inputField.value = '';
  resultField.innerHTML = '';
})
