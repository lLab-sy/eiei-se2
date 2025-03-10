const { Given, When, Then } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const assert = require('assert');

let browser, page;

Given('the producer is on the login page', async function () {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
});

When('the producer enters valid username and password', async function () {
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', 'producersan@test.com');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="password"]', 'producer!!!');
});

When('the producer enters an invalid username or password', async function () {
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', 'wrongUser');
  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="password"]', 'wrongPass');
});

When('clicks the login button', async function () {
  await page.click('[type="submit"]');
  await page.waitForNavigation();
  await page.waitForSelector('button.p-2.hover\\:bg-blue-800'); // Escape ":" in class
  await page.click('button.p-2.hover\\:bg-blue-800');
});

Then('the producer should be redirected to the dashboard', async function () {
  const url = await page.url();
  assert.strictEqual(url, 'http://localhost:3000/s');
  await browser.close();
});

Then('an error message should be displayed', async function () {
  await page.waitForSelector('.error-message'); // Replace with the actual class for your error message
  const errorMessage = await page.$eval('.error-message', el => el.innerText);
  assert.strictEqual(errorMessage, 'Invalid username or password');
  await browser.close();
});