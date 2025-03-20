import { Given, When, Then, world } from '@cucumber/cucumber';
// import { ElementHandle } from 'puppeteer';
import { ICustomWorld } from '../../utils/custom-world';
import { expect } from '@playwright/test';

let customWorld: ICustomWorld = world;

Given('has a target production professional', async function () {
  const page = customWorld.page;
  if (page){
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole('banner').getByRole('button').click();
    await page.getByText("Search for Professionals").click();

    const professionals = page.getByText("View More");
    expect(professionals).not.toBeNull();
    const count = await professionals.count();
    await professionals.nth(Math.floor(Math.random() * count)).click()
    await page.waitForLoadState("domcontentloaded");
    await page.getByText("Contact", {exact: true}).click();    
  }
});

Given('the producer has their own posts', async function () {
  const page = customWorld.page;
  if (page){
    const postBox = page.getByRole('combobox').nth(0);
    await postBox.click();
    const postOptions = page.getByRole('option');
    const count = await postOptions.count();
    await postOptions.nth(Math.floor(Math.random() * count)).click();
  }
});

Given('the producer fills out the offer details', async function () {
  const page = customWorld.page;
  if (page){
    await page.getByRole('textbox', { name: 'description' }).fill('This should be how the description for any offer');
    await page.getByPlaceholder('200').fill('500');
    const roleBox = page.getByRole('combobox').nth(1);
    await roleBox.click();
    const roleOptions = page.getByRole('option');
    const count = await roleOptions.count();
    await roleOptions.nth(Math.floor(Math.random() * count)).click();
    // await page.waitForSelector('textarea[name="description"]', { visible: true });
    // await page.type('textarea[name="description"]', 'This should be how the description for any offer normally looks like in the input field'
    //   , {delay: 25}
    // );
    
    // await page.waitForSelector('input[name="price"]');
    // await page.type('input[name="price"]', '500', {delay: 50});
    // await page.waitForSelector('button[role="combobox"]');
    // const offerCombobox = (await page.$$('button[role="combobox"]'))[1];
    // await offerCombobox.click();
    // await page.waitForSelector('[data-radix-popper-content-wrapper]', { visible: true });
    // await page.click('[data-radix-popper-content-wrapper] div:nth-child(1)');
  }
});

Given('the producer does not fill out the price', async function () {
  const page = customWorld.page;
  if (page){
    await page.getByRole('textbox', { name: 'description' }).fill('This should be how the description for any offer');
    const roleBox = page.getByRole('combobox').nth(1);
    await roleBox.click();
    const roleOptions = page.getByRole('option');
    const count = await roleOptions.count();
    await roleOptions.nth(Math.floor(Math.random() * count)).click();
    // await page.waitForSelector('textarea[name="description"]', { visible: true });
    // await page.type('textarea[name="description"]', 'This should be how the description for any offer normally looks like in the input field'
    //   , {delay: 25}
    // );
    
    // await page.waitForSelector('input[name="price"]');
    // await page.type('input[name="price"]', '500', {delay: 50});
    // await page.waitForSelector('button[role="combobox"]');
    // const offerCombobox = (await page.$$('button[role="combobox"]'))[1];
    // await offerCombobox.click();
    // await page.waitForSelector('[data-radix-popper-content-wrapper]', { visible: true });
    // await page.click('[data-radix-popper-content-wrapper] div:nth-child(1)');
  }
});

When('the producer clicks create offer button', async function () {
  const page = customWorld.page;
  if (page){
    await page.getByRole('button',{name:"Send Offer"}).click();
    await page.getByRole('button',{name: "Confirm"}).click();
    // await page.click('button[aria-haspopup="dialog"]');
    // await page.waitForSelector('div[role="alertdialog"]', { visible: true });
    // await page.waitForSelector('button.bg-green-700', { visible: true });
    // await page.click('button.bg-green-700');
  }
});

Then('ensure the system sends an offer to production professional', async function () {
  const page = customWorld.page;
  if (page){
    const successMessage = page.getByText("Successful offer creation", {exact: true})
    expect(successMessage).toBeVisible();
    // await page.waitForSelector('li[role="status"][data-state="open"]', { visible: true });
    // const toastMessage = await page.$eval('li[role="status"] .text-sm.font-semibold', el => el.textContent);
    // assert.strictEqual(toastMessage, "Successful offer creation");
  }
});

Then('ensure the system shows the offer in producer post\'s offer list', async function () {
  return 'pending';
});

Then('ensure the system sends a message failed to create an offer with a production professional', async function () {
  const page = customWorld.page;
  if (page){
    await expect(page.getByText("Price more than 0.")).toBeVisible();
  }
});