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

    await page.waitForURL('**\/professionals', {waitUntil:'domcontentloaded'})
    const professionals = page.getByRole('link',{name:"View More"});
    expect(professionals).not.toBeNull();
    const count = await professionals.count();
    await professionals.nth(Math.floor(Math.random() * count)).click()

    await page.waitForURL('**\/professionals\/**', {waitUntil:'domcontentloaded'})
    if (action !== "Does Nothing") {
      await page.getByText(action, {exact: true}).click();  
    }
  }
});

Given('the producer has a project on state {string}', async function (stateName: string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: stateName }).click();
        expect(await page.locator('a').count()).toBeGreaterThan(0)
    }
});

Given('the producer has the project {string}', async function (postName: string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        await page.waitForLoadState("domcontentloaded");
        await expect(page.getByText(postName)).toBeVisible()
    }
});

Given('the producer click on the project {string}', async function (postName: string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        await page.waitForLoadState("domcontentloaded");
        await page.getByText(postName).click()
    }
});

Given('the producer has production prodessional {string} the submissionns', async function (participantStatus: string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        await page.waitForLoadState("domcontentloaded");
        await expect(page.getByText(participantStatus).first()).toBeVisible()
    }
});

When('{string} button in confirmation is clicked', async function (buttonType:string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        await page.waitForLoadState("domcontentloaded");
        if (buttonType == 'Approve') {
            await page.getByTestId('Professional-working-cards').getByRole('button').first().click();
        } else {
            await page.getByTestId('Professional-working-cards').getByRole('button').nth(1).click();
        }
    }
});

When('{string} button in popup is clicked', async function (btnName: string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: 'Confirm' }).click();
    }
});

When('I click the {string} button', async function (btnName: string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', { name: btnName }).click();
    }
});

Then('ensure the production professional status is {string}', async function (participantStatus: string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        await page.waitForLoadState("domcontentloaded");
        await expect(page.getByText(participantStatus).nth(0)).toBeVisible()
    }
});

Then('ensure all production professional status is {string}', async function (status: string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        await page.waitForLoadState("domcontentloaded");
        expect(await page.getByText(status).count()).toBeGreaterThanOrEqual(3)
    }
});

Then('the post status is {string}', async function (status:string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        await page.waitForLoadState("domcontentloaded");
        // console.log(page.locator('[data-test-id="post-status"]').textContent())
        // expect(page.locator('[data-test-id="post-status"]').textContent()).toContain(status)
        expect(page.getByText(status).first()).toBeVisible()
    }
});