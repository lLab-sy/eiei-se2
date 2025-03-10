const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const assert = require('assert');

let browser, page;

Given('the producer is logged in', async function () {
  // Navigate to the login page and simulate login.
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto("http://localhost:3000/");
  await page.waitForSelector('button.p-2.hover\\:bg-blue-800'); // Escape ":" in class
  await page.click('button.p-2.hover\\:bg-blue-800');
  await page.$eval(`a[href='/login']`, element => element.click());
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', 'producersan@test.com');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="password"]', 'producer!!!');
  await page.click('[type="submit"]');
  await page.waitForNavigation();
});

Given('has a target production professional', async function () {
  // Simulate selection of a production professional.
  await page.waitForSelector('button.p-2.hover\\:bg-blue-800'); // Escape ":" in class
  await page.click('button.p-2.hover\\:bg-blue-800');
  await page.$eval(`a[href='/professionals']`, element => element.click());
  await page.waitForNavigation();
  await page.waitForFunction(() => {
    return [...document.querySelectorAll('a')].some(a => a.href.match(/\/professionals\/\d+/));
  });
  const elementHandle = await page.evaluateHandle(() => {
    const links = [...document.querySelectorAll('a')];

    // Filter links that match the pattern '/professionals/{some-id}'
    const matchingLinks = links.filter(a => a.href.match(/\/professionals\/\d+/));
    console.log(matchingLinks)
    // Pick a random link if any exist
    return matchingLinks.length > 0 ? matchingLinks[Math.floor(Math.random() * matchingLinks.length)] : null;
  });
  if (elementHandle) {
    console.log('Random matching element found!');
    await elementHandle.click(); // Click on the element
    await page.waitForNavigation();
  }
});