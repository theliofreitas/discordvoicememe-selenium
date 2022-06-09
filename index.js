const { Builder, By, until } = require("selenium-webdriver");
const database = require('./src/database.js');
const MemeAudio = require("./src/MemeAudio");

require("dotenv").config();

const LOGIN = process.env.MYINSTANTS_LOGIN;
const PASSWORD = process.env.MYINSTANTS_PASSWORD;
const BASE_URL = process.env.MYINSTANTS_URL;

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
  const memeAudioList = [];

  for (let index = 0; index < elements.length; index++) {
    let element = elements[index];

    // Get MemeAudio label from the DOM
    let label = await element.findElement(By.css('a.instant-link.link-secondary')).getText().then(function(value) {
      return value;
    });

    // Get MemeAudio playUrl from the DOM
    let playUrl = await element.findElement(By.css('button.small-button')).getAttribute('onclick').then(function(value) {
      let urlFormat = value.replace("play('", "");
      urlFormat = urlFormat.substr(0, urlFormat.length -2);
      urlFormat = BASE_URL + urlFormat;

      return urlFormat;
    });

    // Get MemeAudio color from the DOM
    let color = await element.findElement(By.css('div.circle.small-button-background')).getCssValue('background-color').then(function(value) {
      return value;
    });

    // New instance of MemeAudio class
    const memeAudio = new MemeAudio(label, playUrl, color);

    memeAudioList.push(memeAudio);
  }

  // Insert the list of MemeAudio into the database
  database.insertMemeAudio(memeAudioList);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

start();