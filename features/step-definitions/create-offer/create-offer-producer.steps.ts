import { Given, When, Then, world } from '@cucumber/cucumber';
import { ElementHandle } from 'puppeteer';
import { ICustomWorld } from '../../utils/custom-world';
import assert from "assert";

let customWorld: ICustomWorld = world;

Given('has a target production professional', async function () {
  const page = customWorld.page;
  if (page){
    await page.waitForSelector('button.p-2.hover\\:bg-blue-800');
    await page.click('button.p-2.hover\\:bg-blue-800');
    await Promise.all([
      page.waitForNavigation({waitUntil: 'load', timeout: 0}), 
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
  }
});

Given('the producer has their own posts', async function () {
  const page = customWorld.page;
  if (page){
    await page.waitForSelector('button[role="combobox"]');
    await page.click('button[role="combobox"]');
    await page.waitForSelector('[data-radix-popper-content-wrapper]', { visible: true });
    await page.click('[data-radix-popper-content-wrapper] div:nth-child(1)');
  }
});

Given('the producer fills out the offer details', async function () {
  const page = customWorld.page;
  if (page){
    await page.waitForSelector('textarea[name="description"]', { visible: true });
    await page.type('textarea[name="description"]', 'This should be how the description for any offer normally looks like in the input field'
      , {delay: 25}
    );
    
    await page.waitForSelector('input[name="price"]');
    await page.type('input[name="price"]', '500', {delay: 50});
    await page.waitForSelector('button[role="combobox"]');
    const offerCombobox = (await page.$$('button[role="combobox"]'))[1];
    await offerCombobox.click();
    await page.waitForSelector('[data-radix-popper-content-wrapper]', { visible: true });
    await page.click('[data-radix-popper-content-wrapper] div:nth-child(1)');
  }
});

Given('the producer does not fill out the price', async function () {
  const page = customWorld.page;
  if (page){
    await page.waitForSelector('textarea[name="description"]', { visible: true });
    await page.type('textarea[name="description"]', 'This should be how the description for any offer normally looks like in the input field'
      , {delay: 25}
    );

    await page.waitForSelector('button[role="combobox"]');
    await page.click('button[aria-controls="radix-:rg:"]');
    await page.waitForSelector('[data-radix-popper-content-wrapper]', { visible: true });
    await page.click('[data-radix-popper-content-wrapper] div:nth-child(1)');
  }
});

When('the producer clicks create offer button', async function () {
  const page = customWorld.page;
  if (page){
    await page.waitForSelector('button[aria-haspopup="dialog"]');
    await page.click('button[aria-haspopup="dialog"]');
    await page.waitForSelector('div[role="alertdialog"]', { visible: true });
    await page.waitForSelector('button.bg-green-700', { visible: true });
    await page.click('button.bg-green-700');
  }
});

Then('ensure the system sends an offer to production professional', async function () {
  const page = customWorld.page;
  if (page){
    await page.waitForSelector('li[role="status"][data-state="open"]', { visible: true });
    const toastMessage = await page.$eval('li[role="status"] .text-sm.font-semibold', el => el.textContent);
    assert.strictEqual(toastMessage, "Successful offer creation");
  }
});

Then('ensure the system shows the offer in producer post\'s offer list', async function () {
  return 'pending';
});

Then('ensure the system sends a message failed to create an offer with a production professional', async function () {
  const page = customWorld.page;
  if (page){
    await page.waitForFunction(() => {
      return Array.from(document.querySelectorAll('p[id$="-form-item-message"]'))
        .some(el => el.textContent?.includes("Price more than 0."));
    });
  }
});