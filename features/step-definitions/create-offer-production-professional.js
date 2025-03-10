const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const assert = require('assert');

let browser, page;

Given('the production professional is logged in', async function () {
  // Navigate to the login page and simulate login.
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto("http://localhost:3000/");
  await page.waitForSelector('button.p-2.hover\\:bg-blue-800'); // Escape ":" in class
  await page.click('button.p-2.hover\\:bg-blue-800');
  await page.$eval(`a[href='/login']`, element => element.click());
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', 'production@test.com');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="password"]', 'production!');
  await page.click('[type="submit"]');
  await page.waitForNavigation();
});

Given('has target post', async function () {
  // Simulate selection of a production professional.
  await page.waitForSelector('button.p-2.hover\\:bg-blue-800'); // Escape ":" in class
  await page.click('button.p-2.hover\\:bg-blue-800');
  await page.$eval(`a[href='/posts']`, element => element.click());
  await page.waitForNavigation();
  await page.waitForFunction(() => {
    return [...document.querySelectorAll('a')].some(a => a.href.match(/\/posts\/\d+/));
  });
  const elementHandle = await page.evaluateHandle(() => {
    const links = [...document.querySelectorAll('a')];

    // Filter links that match the pattern '/professionals/{some-id}'
    const matchingLinks = links.filter(a => a.href.match(/\/posts\/\d+/));
    console.log(matchingLinks)
    // Pick a random link if any exist
    return matchingLinks.length > 0 ? matchingLinks[Math.floor(Math.random() * matchingLinks.length)] : null;
  });
  if (elementHandle) {
    await elementHandle.click(); // Click on the element
    await page.waitForNavigation();
    await page.waitForSelector('a[href*="/create-offer/"]');
    await page.click('a[href*="/create-offer/"]');
    await page.waitForNavigation();
  }
});

Given('the production professional fills out the offer details', async function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Given('the production professional does not fill out the price', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

When('the production professional clicks create offer button', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('ensure the system sends an offer to producer', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('ensure that the system shows the offer in his production professional\'s all job', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('ensure the system adds change to offer\'s history', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('ensure the system sends a message failed to create an offer with a production professional.', async function () {
  await page.waitForSelector('#\\:rd\\:-form-item-message');
  return 'pending';
});