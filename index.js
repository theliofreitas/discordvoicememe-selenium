const { Builder, By, Key, until } = require("selenium-webdriver");
require("dotenv").config();

const LOGIN = process.env.MYINSTANTS_LOGIN;
const PASSWORD = process.env.MYINSTANTS_PASSWORD;

async function start() {
  let driver = await new Builder()
    .forBrowser('firefox')
    .build();

  // Login
  await driver.get('https://www.myinstants.com/accounts/login/');
  await driver.findElement(By.name('login')).sendKeys(LOGIN);
  await driver.findElement(By.name('password')).sendKeys(PASSWORD);
  await driver.findElement(By.xpath('//form[@action="/accounts/login/"]')).submit();

  await driver.wait(until.urlIs('https://www.myinstants.com/pt/favorites/'), 10000, 'Time out'); // 10s
  await driver.wait(until.elementLocated(By.className('instant')), 10000, 'Time out'); // 10s
  await sleep(10000); // 10s

  // Loop through sound elements
  const elements = await driver.findElements(By.css('.instant div.instant'));

  const audioArray = [];

  for (let index = 0; index < elements.length; index++) {
    let element = elements[index];

    let audioLabel = await element.findElement(By.css('a.instant-link.link-secondary')).getText().then(function(value) {
      return value;
    });

    let audioUrl = await element.findElement(By.css('button.small-button')).getAttribute('onclick').then(function(value) {
      let urlFormat = value.replace("play('", "");
      urlFormat = urlFormat.substr(0, urlFormat.length -2);

      return urlFormat;
    });

    let buttonColor = await element.findElement(By.css('div.circle.small-button-background')).getCssValue('background-color').then(function(value) {
      return value;
    });

    let audio = {
      label: audioLabel,
      url: audioUrl,
      color: buttonColor,
    };

    audioArray.push(audio);
  }

  console.log(audioArray);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

start();