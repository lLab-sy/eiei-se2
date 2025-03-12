import { Given, When, Then } from '@cucumber/cucumber';
import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';
import assert from "assert";

let browser: Browser;
let page: Page;

Given('the producer is logged in', async function () {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();

  await page.goto("http://localhost:3000/");
  await page.waitForSelector('button.p-2.hover\\:bg-blue-800');
  await page.click('button.p-2.hover\\:bg-blue-800');
  // await page.$eval(`a[href='/login']`, element => element.click());
  await Promise.all([
      page.waitForNavigation(), 
      await page.$eval(`a[href='/login']`, element => element.click())
    ]);

  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', 'testpd1', {delay: 50});

  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="password"]', 'testpd1@#T', {delay: 50});

  await Promise.all([
    page.waitForNavigation(), 
    await page.click('[type="submit"]')
  ]);
  // await page.click('[type="submit"]');
  // await page.waitForNavigation();
});

Given('has a target production professional', async function () {
  await page.waitForSelector('button.p-2.hover\\:bg-blue-800');
  await page.click('button.p-2.hover\\:bg-blue-800');
  await Promise.all([
    page.waitForNavigation(), 
    await page.$eval(`a[href='/professionals']`, element => element.click())
  ]);

  await page.waitForFunction(() => {
    return [...document.querySelectorAll('a')].some(a => a.href.match(/\/professionals\/\d+/));
  });

  const elementHandle = await page.evaluateHandle(() => {
    const links = Array.from(document.querySelectorAll('a'))
      .filter((a) => a.href.match(/\/professionals\/\d+/));
    return links.length > 0 ? links[Math.floor(Math.random() * links.length)] : null;
  });

  const element = elementHandle.asElement() as ElementHandle<Element>;
  if (element) {
    await Promise.all([
      page.waitForNavigation(), 
      element.click(), 
    ]);
    await page.waitForSelector('a[href*="/create-offer/"]');
    await Promise.all([
      page.waitForNavigation(), 
      await page.click('a[href*="/create-offer/"]'), 
    ]);
  }
});

Given('the producer has their own posts', async function () {
  await page.waitForSelector('button[aria-controls="radix-:rc:"]');
  await page.click('button[aria-controls="radix-:rc:"]');
  await page.waitForSelector('[data-radix-popper-content-wrapper]', { visible: true });
  await page.click('[data-radix-popper-content-wrapper] div:nth-child(1)');
});

Given('the producer fills out the offer details', async function () {
  await page.waitForSelector('textarea[name="description"]', { visible: true });
  await page.type('textarea[name="description"]', 'This should be how the description for any offer normally looks like in the input field'
    , {delay: 25}
  );
  
  await page.waitForSelector('input[name="price"]');
  await page.type('input[name="price"]', '500', {delay: 50});
  await page.click('button[aria-controls="radix-:rg:"]');
  await page.waitForSelector('[data-radix-popper-content-wrapper]', { visible: true });
  await page.click('[data-radix-popper-content-wrapper] div:nth-child(1)');
});

Given('the producer does not fill out the price', async function () {
  await page.waitForSelector('textarea[name="description"]', { visible: true });
  await page.type('textarea[name="description"]', 'This should be how the description for any offer normally looks like in the input field'
    , {delay: 25}
  );

  await page.waitForSelector('button[role="combobox"]');
  await page.click('button[aria-controls="radix-:rg:"]');
  await page.waitForSelector('[data-radix-popper-content-wrapper]', { visible: true });
  await page.click('[data-radix-popper-content-wrapper] div:nth-child(1)');
});

When('the producer clicks create offer button', async function () {
  await page.waitForSelector('button[aria-haspopup="dialog"]');
  await page.click('button[aria-haspopup="dialog"]');
  await page.waitForSelector('div[role="alertdialog"]', { visible: true });
  await page.waitForSelector('button.bg-green-700', { visible: true });
  await page.click('button.bg-green-700');
});

Then('ensure the system sends an offer to production professional', async function () {
  await page.waitForSelector('li[role="status"][data-state="open"]', { visible: true });
  const toastMessage = await page.$eval('li[role="status"] .text-sm.font-semibold', el => el.textContent);
  assert.strictEqual(toastMessage, "Successful offer creation");
});

Then('ensure the system shows the offer in producer post\'s offer list', async function () {
  return 'pending';
});

Then('ensure the system sends a message failed to create an offer with a production professional', async function () {
  await page.waitForFunction(() => {
    return Array.from(document.querySelectorAll('p[id$="-form-item-message"]'))
      .some(el => el.textContent?.includes("Price more than 0."));
  });
});