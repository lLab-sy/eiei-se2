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
        // const targetCard =await page.getByText(string)
        // const countWorking=await container.locator('a[href]').count();
        await expect(page.getByText(string)).toBeVisible();
        await page.getByText(string).click()
        // console.log("num",page.getByText(string).count())
    }

  });

Then('Professional should click at {string} and see recent task', async function (string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page){
      await page.waitForLoadState('domcontentloaded')
      await page.waitForTimeout(500);
      const beforeAdd=await page.getByText("/3").count()
      await page.getByText(string).click(string)
      await page.getByText("Confirm").click()
      const afterAdd=await await page.getByText("/3").count()
      expect(afterAdd-beforeAdd).toEqual(1)
    }
  });

  Then('Professional can see all his task {string} times in post detail and has no {string}', async function (string, string2) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page){
      await page.waitForLoadState('domcontentloaded')
      await page.waitForTimeout(1000);
      const count=await page.getByText("/3").count()
      expect(count).toEqual(parseInt(string))
      await expect(page.getByText(string2)).not.toBeVisible();
    }
  });
