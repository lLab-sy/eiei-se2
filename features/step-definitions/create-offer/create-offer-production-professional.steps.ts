import { Given, When, Then, world } from '@cucumber/cucumber';
// import { ElementHandle } from 'puppeteer';
import { ICustomWorld } from '../../utils/custom-world';
import { expect } from "@playwright/test"

let customWorld: ICustomWorld = world;

Given('has target post', async function () {
  const page = customWorld.page;
  if (page){
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole('banner').getByRole('button').click();
    await page.getByText("Search for Posts").click();
    const posts = page.getByText("View More");
    expect(posts).not.toBeNull();
    const count = await posts.count();
    await posts.nth(Math.floor(Math.random() * count)).click()
    await page.waitForLoadState("domcontentloaded");
    await page.getByText("Send Offer", {exact: true}).click();  
    }
  }
);

Given('the production professional fills out the offer details', async function () {
  const page = customWorld.page;
  if (page){
    await page.getByRole('textbox', { name: 'description' }).fill('This should be how the description for any offer');
    await page.getByPlaceholder('200').fill('500');
    const roleBox = page.getByRole('combobox');
    await roleBox.click();
    const roleOptions = page.getByRole('option');
    const count = await roleOptions.count();
    await roleOptions.nth(Math.floor(Math.random() * count)).click();
  }
});

Given('the production professional does not fill out the price', async function () {
  const page = customWorld.page;
  if (page){
    await page.getByRole('textbox', { name: 'description' }).fill('This should be how the description for any offer');
    const roleBox = page.getByRole('combobox');
    await roleBox.click();
    const roleOptions = page.getByRole('option');
    const count = await roleOptions.count();
    await roleOptions.nth(Math.floor(Math.random() * count)).click();
  }
});

// Then('ensure the system sends an offer to producer', async function () {
//   const page = customWorld.page;
//   if (page){
//     await page.waitForSelector('li[role="status"][data-state="open"]', { visible: true });
//     const toastMessage = await page.$eval('li[role="status"] .text-sm.font-semibold', el => el.textContent);
//     assert.strictEqual(toastMessage, "Successful offer creation");
//   }
// });

Then('ensure that the system shows the offer in his production professional\'s all job', async function () {
  return 'pending';
});

Then('ensure the system adds change to offer\'s history', async function () {
  return 'pending';
});

Then('ensure the system sends a message failed to create an offer with a production professional.', async function () {
  const page = customWorld.page;
    if (page){
      await expect(page.getByText("Price more than 0.")).toBeVisible();
    }
});

Then('ensure the system adds change to offer history', function () {
  // Write code here that turns the phrase above into concrete actions
  return 'pending';
});