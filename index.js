const {Builder, By, Key, Util} = require("selenium-webdriver");

async function example() {
  let driver = await new Builder().forBrowser('firefox').build();
  await driver.get('https://google.com');

}

example();