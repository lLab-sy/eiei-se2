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
    console.log('Production professional found!');
    await elementHandle.click(); // Click on the element
    await page.waitForNavigation();
    await page.waitForSelector('a[href*="/create-offer/"]');
    await page.click('a[href*="/create-offer/"]');
    await page.waitForNavigation();
  }
});

Given('the producer has their own posts', async function () {
  // Write code here that turns the phrase above into concrete actions
  await page.waitForSelector('button[aria-controls="radix-:rc:"]');
  await page.click('button[aria-controls="radix-:rc:"]');
  await page.waitForSelector('[data-radix-popper-content-wrapper]', { visible: true });
  await page.click('[data-radix-popper-content-wrapper] div:nth-child(1)');
});

Given('the producer fills out the offer details', async function () {
  // Write code here that turns the phrase above into concrete actions
  await page.waitForSelector('textarea[name="description"]',{ visible: true })
  await page.type('textarea[name="description"]', 'This should be how the description for any offer normally looks like in the input field');
  await page.waitForSelector('input[name="price"]')
  console.log("Got Price")
  await page.evaluate(() => {
    document.querySelector('input[name="price"]').value = '';
  });
  await page.type('input[name="price"]', '500');
  await page.click('button[aria-controls="radix-:rg:"]');
  await page.waitForSelector('[data-radix-popper-content-wrapper]', { visible: true });
  await page.click('[data-radix-popper-content-wrapper] div:nth-child(1)');
});

Given('the producer does not fill out the price', async function () {
  // Write code here that turns the phrase above into concrete actions
  await page.waitForSelector('textarea[name="description"]',{ visible: true })
  await page.type('textarea[name="description"]', 'This should be how the description for any offer normally looks like in the input field');
  await page.waitForSelector('button[role="combobox"]')
  await page.click('button[role="combobox"]');
  await page.waitForSelector('[data-radix-popper-content-wrapper]', { visible: true });
  await page.click('[data-radix-popper-content-wrapper] div:nth-child(1)');
});

When('the producer clicks create offer button', async function () {
  // Write code here that turns the phrase above into concrete actions
  await page.waitForSelector('button[aria-haspopup="dialog"]')
  await page.click('button[aria-haspopup="dialog"]')
  await page.waitForSelector('div[role="alertdialog"]', { visible: true }); 
  await page.waitForSelector('button.bg-green-700', { visible: true });
  console.log("Can Submit")
  // await page.click('button.bg-green-700');
});

Then('ensure the system sends an offer to production professional', async function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('ensure the system shows the offer in producer post\'s offer list', async function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});

Then('ensure the system sends a message failed to create an offer with a production professional', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});