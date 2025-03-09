import { Given, When, Then, Before, After } from '@cucumber/cucumber'
import puppeteer from 'puppeteer';
import {assert} from 'chai';

let browser, page;

Before(async function () {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
});

After(async function () {
  await browser.close();
});

Given('the producer is logged in', async function () {
  // Navigate to the login page and simulate login.
  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('[data-testid="loginUsername"]');
  await page.type('[data-testid="loginUsername"]', 'producerUser');
  await page.type('[data-testid="loginPassword"]', 'producerPass');
  await page.click('[data-testid="loginButton"]');
  await page.waitForNavigation();
});

Given('the producer has target posts', async function () {
  // Assume the target posts are visible on the producer dashboard.
  await page.goto('http://localhost:3000/producer/dashboard');
  await page.waitForSelector('[data-testid="targetPost"]');
});

Given('the producer has a target production professional', async function () {
  // Simulate selection of a production professional.
  await page.goto('http://localhost:3000/producer/targetProfessional');
  await page.waitForSelector('[data-testid="targetProfessional"]');
  await page.click('[data-testid="targetProfessional"]');
});

Given('the wages field is filled with {string}', async function (wages) {
  // Navigate to the offer creation page and fill in wages.
  await page.goto('http://localhost:3000/producer/createOffer');
  await page.waitForSelector('[data-testid="wagesInput"]');
  await page.click('[data-testid="wagesInput"]', { clickCount: 3 });
  await page.type('[data-testid="wagesInput"]', wages);
});

Given('the wages field is not filled out', async function () {
  // Navigate to the offer creation page but leave wages empty.
  await page.goto('http://localhost:3000/producer/createOffer');
  await page.waitForSelector('[data-testid="wagesInput"]');
  // No typing, leaving the wages field blank.
});

When('the producer requests to create an offer', async function () {
  // Simulate clicking the "Create Offer" button.
  await page.waitForSelector('[data-testid="createOfferButton"]');
  await page.click('[data-testid="createOfferButton"]');
  // Allow time for the UI to process the request.
  await page.waitForTimeout(1000);
});

Then('the system sends an offer to the production professional', async function () {
  // Check for an indicator that the offer was sent.
  await page.waitForSelector('[data-testid="offerSentIndicator"]');
  const offerSentText = await page.$eval('[data-testid="offerSentIndicator"]', el => el.textContent);
  expect(offerSentText).to.include('Offer sent');
});

Then('the offer appears in the producer post\'s offer list', async function () {
  // Verify that the offer appears in the offer list.
  await page.goto('http://localhost:3000/producer/posts');
  await page.waitForSelector('[data-testid="offerList"]');
  const offerListContent = await page.$eval('[data-testid="offerList"]', el => el.textContent);
  expect(offerListContent).to.include('Offer for production professional');
});

Then('the system adds a change to the offer\'s history', async function () {
  // Check that the offer history has been updated.
  await page.goto('http://localhost:3000/producer/offerHistory');
  await page.waitForSelector('[data-testid="offerHistory"]');
  const historyContent = await page.$eval('[data-testid="offerHistory"]', el => el.textContent);
  expect(historyContent).to.include('Created offer');
});

Then('the system shows an error message {string}', async function (expectedMessage) {
  // Verify that the error message is displayed.
  await page.waitForSelector('[data-testid="errorMessage"]');
  const errorText = await page.$eval('[data-testid="errorMessage"]', el => el.textContent);
  expect(errorText).to.equal(expectedMessage);
});