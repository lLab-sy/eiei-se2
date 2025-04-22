import { Given, When, Then, world } from '@cucumber/cucumber';
// import { ElementHandle } from 'puppeteer';
import { ICustomWorld } from '../../utils/custom-world';
import { expect } from "@playwright/test"

let customWorld: ICustomWorld = world;

Given('the production professional has a target post and {string}', async function (action:string) {
  const page = customWorld.page;
  if (page){
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole('banner').getByRole('button').click();
    await page.getByRole('link',{name:"Search for Posts"}).click();
    await page.waitForURL('**\/posts', {waitUntil:'domcontentloaded'})
    const posts = page.getByRole('link',{name:"View More"});
    expect(posts).not.toBeNull();
    const count = await posts.count();
    await posts.nth(Math.floor(Math.random() * count)).click()
    await page.waitForURL('**\/posts\/**', {waitUntil:'domcontentloaded'})
    await page.getByRole('link',{name: action, exact: true}).click();  
    }
  }
);

Given('the production professional fills out the offer details', async function () {
  const page = customWorld.page;
  if (page){
    await page.waitForURL('**\/create-offer\/**', {waitUntil:'domcontentloaded'})
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
    await page.waitForURL('**\/create-offer\/**', {waitUntil:'domcontentloaded'})
    await page.getByRole('textbox', { name: 'description' }).fill('This should be how the description for any offer');
    const roleBox = page.getByRole('combobox');
    await roleBox.click();
    const roleOptions = page.getByRole('option');
    const count = await roleOptions.count();
    await roleOptions.nth(Math.floor(Math.random() * count)).click();
  }
});


Given('the production professional fill out the price as {int}', async function (int) {
  // Given('the production professional fill out the price as {float}', async function (float) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page){
      await page.waitForURL('**\/create-offer\/**', {waitUntil:'domcontentloaded'})
      await page.getByRole('textbox', { name: 'description' }).fill('This should be how the description for any offer');
      await page.getByPlaceholder('200').fill('0');
      const roleBox = page.getByRole('combobox');
      await roleBox.click();
      const roleOptions = page.getByRole('option');
      const count = await roleOptions.count();
      await roleOptions.nth(Math.floor(Math.random() * count)).click();
    }
  });

Given('the production professional does not select role', async function () {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page){
      await page.getByRole('textbox', { name: 'description' }).fill('This should be how the description for any offer');
      await page.getByPlaceholder('200').fill('500');
    }
  });
Given('the production professional fill out description at most {int} characters', async function (int) {
  const page = customWorld.page;
  if (page){
    await page.getByRole('textbox', { name: 'description' }).fill('Hello');
    await page.getByPlaceholder('200').fill('500');
    const roleBox = page.getByRole('combobox').nth(0);
    await roleBox.click();
    const roleOptions = page.getByRole('option');
    const count = await roleOptions.count();
    await roleOptions.nth(Math.floor(Math.random() * count)).click();
  }
    });
Given('the production professional fill out description more than {int} characters', async function (int) {
      // Given('the production professional fill out description more than {float} characters', async function (float) {
        // Write code here that turns the phrase above into concrete actions
        const page = customWorld.page;
        if (page) {
          let text1 = "1";
          let result = "";
          for (let i = 0; i <= int; i++) {
            result += text1; // Fix: use += instead of concat()
          }
          await page.getByRole('textbox', { name: 'description' }).fill(result);
          await page.getByPlaceholder('200').fill('500');
      
          const roleBox = page.getByRole('combobox').nth(0);
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