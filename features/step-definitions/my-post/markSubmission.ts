import { Given, When, Then, world } from '@cucumber/cucumber';
// import { ElementHandle } from 'puppeteer';
import { ICustomWorld } from '../../utils/custom-world';
import { expect } from '@playwright/test';

let customWorld: ICustomWorld = world;
When('the professional view his\\/her {string}', async function (string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page){
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('banner').getByRole('button').click();
        await page.getByText("My Post").click();
        
        await page.waitForURL('**\/my-post', {waitUntil:'domcontentloaded'})
        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: 'in-progress' }).click();
        
        const container=await page.getByTestId('Post-cards-container')
        const countWorking=await container.locator('a[href]').count();

    }

  });

Then('Professional should click at {string}', async function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });

Then('Professional can see recent task {string} in post detail', async function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });

Then('Professional can see all his task {string} times in post detail', async function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });
