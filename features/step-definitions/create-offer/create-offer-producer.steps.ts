import { Given, When, Then, world } from '@cucumber/cucumber';
// import { ElementHandle } from 'puppeteer';
import { ICustomWorld } from '../../utils/custom-world';
import { expect } from '@playwright/test';

let customWorld: ICustomWorld = world;

Given('the producer has a target production professional and {string}', async function (action:string) {
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
    await page.getByText(action, {exact: true}).click();  
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
  }
});

// Then('ensure the system sends an offer to production professional', async function () {
//   const page = customWorld.page;
//   if (page){
//     const successMessage = page.getByText("Successful offer creation", {exact: true})
//     expect(successMessage).toBeVisible();
//     // await page.waitForSelector('li[role="status"][data-state="open"]', { visible: true });
//     // const toastMessage = await page.$eval('li[role="status"] .text-sm.font-semibold', el => el.textContent);
//     // assert.strictEqual(toastMessage, "Successful offer creation");
//   }
// });

Then('ensure the system shows the offer in producer post\'s offer list', async function () {
  return 'pending';
});

Then('ensure the system sends a message failed to create an offer with a production professional', async function () {
  const page = customWorld.page;
  if (page){
    await expect(page.getByText("Price more than 0.")).toBeVisible();
  }
});