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
    const description = getArrayURLs[i].match(/\%3E+(.+)\.png/)[1];

    if (!sortedScreenshots[name]) {
      sortedScreenshots[name] = [];
    };

    sortedScreenshots[name].push({ description: decodeURI(description).replace(/%3A/g, '/'), url: getArrayURLs[i] });
  }

  return sortedScreenshots;
}

const renderResult = (obj) => {
  for (key in obj) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const group = obj[key]

    details.className = 'details';
    summary.className = 'summary';

    summary.innerHTML = key;
    details.append(summary);

    for (let i = 0; i < group.length; i += 1) {
      const container = document.createElement('div');
      const description = document.createElement('div');
      const image = document.createElement('img');

      container.className = 'item';
      description.className = 'title';
      image.className = 'screenshot';

      description.innerHTML = group[i].description;
      container.append(description);
      image.setAttribute('src', group[i].url);
      container.append(image);

      details.append(container);
    }

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
