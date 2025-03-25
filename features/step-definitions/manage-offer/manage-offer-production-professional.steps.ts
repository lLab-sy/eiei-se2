import { Given, When, Then, world } from '@cucumber/cucumber';
// import { ElementHandle } from 'puppeteer';
import { ICustomWorld } from '../../utils/custom-world';
import { expect, Locator } from "@playwright/test"

let customWorld: ICustomWorld = world;
let offerDialog: Locator;

Given("the production professional choose a {string} offer", async function (label:string){
    const page = customWorld.page;
    if (page){
        const latestOffer = page.locator('div.w-full.bg-white.rounded-lg').filter({has: page.getByText(label)})
        await latestOffer.click();
        offerDialog = page.getByRole('dialog')
        await expect(offerDialog).toBeVisible();
    }
});

Given('the offer owner is the production professional', async function (){
    const page = customWorld.page;
    if (page){
        const offerings = page.locator('div.relative.w-\\[44\\%\\].shadow-md').locator('div.w-full.bg-white.rounded-lg')
        await expect(offerings.first()).toHaveText(/Offer By:Professional/);
    }
});

When('the production professional confirms the offer', async function () {
    // Write code here that turns the phrase above into concrete actions
    const confirmButton = offerDialog.getByRole('button', {name: 'Confirm Offer', exact: true})
    await expect(confirmButton).toBeVisible()
    if (await confirmButton.isEnabled()){
        await confirmButton.click({force:true, clickCount: 1})
        await offerDialog.getByRole('checkbox').check()
        const yesButton = offerDialog.getByRole('button',{name: 'Yes', exact:true})
        await expect(yesButton).toBeEnabled()
        await yesButton.click()
        await expect(offerDialog).toBeHidden()
    }
  });

When('the production professional rejects the offer', async function () {
// Write code here that turns the phrase above into concrete actions
    const rejectButton = offerDialog.getByRole('button', {name: 'Reject Offer', exact: true})
    await expect(rejectButton).toBeVisible()
    await rejectButton.click()

    const yesButton = offerDialog.getByRole('button',{name: 'Yes', exact:true})
    await expect(yesButton).toBeDisabled()
    await offerDialog.getByRole('textbox').fill('Reject Offer')
    await expect(yesButton).toBeEnabled()
    await yesButton.click()

});

When('the production professional wants to create a counteroffer', async function () {
    // Write code here that turns the phrase above into concrete actions
    const counterButton = offerDialog.getByRole('button', {name: 'Counter Offer', exact: true})
    await expect(counterButton).toBeVisible()
    await counterButton.click()

    const yesButton = offerDialog.getByRole('button',{name: 'Yes', exact:true})
    await yesButton.click()
});

Then('the production professional\'s offer status is changed to {string}', async function (expectedStatus:string) {
// Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page){
        const latestOffer = page.locator('div.overflow-scroll.flex').locator('div.w-full.bg-white.rounded-lg').first()
        await expect(latestOffer.getByText(expectedStatus)).toBeVisible()
    }
});

Then('the production professional should be redirected to {string} page', async function (s: string) {
    const page = customWorld.page;
    if (page) {
        await page.waitForURL(`**/${s}/**`, {waitUntil: 'domcontentloaded'});
    }
});
Then('the production professional should not be able to confirm the offer', async function () {
  // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
        if (page) {
            expect(offerDialog.getByRole('button', {name: 'Confirm Offer', exact: true})).toBeDisabled()
    }
});
