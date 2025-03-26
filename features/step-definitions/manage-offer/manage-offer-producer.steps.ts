import { Given, When, Then, world } from '@cucumber/cucumber';
// import { ElementHandle } from 'puppeteer';
import { ICustomWorld } from '../../utils/custom-world';
import { expect, Locator } from "@playwright/test"

let customWorld: ICustomWorld = world;
let offerDialog: Locator;
let offerName: string

Given("the producer choose a {string} offer", async function (label:string){
    const page = customWorld.page;
    if (page){
        const roleCombobox = page.getByRole('combobox').filter({visible: true}).first()
        await roleCombobox.click();
        const roleOptions = page.getByRole('option').filter({visible:true});
        const roleCount = await roleOptions.count();
        await roleOptions.nth(Math.floor(Math.random() * roleCount)).click();

        const pfCombobox = page.getByRole('combobox').filter({visible: true}).nth(1)
        await pfCombobox.click();
        const pfOptions = page.getByRole('option').filter({visible:true});
        const pfCount = await pfOptions.count();
        await pfOptions.nth(Math.floor(Math.random() * pfCount)).click();

        const latestOffer = page.locator('div.bg-card').filter({has: page.getByText(label,{exact:true})})
        offerName = (await latestOffer.getByRole('heading').allInnerTexts()).join('')
        console.log('Offer Name',offerName)
        await latestOffer.click();
        offerDialog = page.getByRole('dialog')
        await expect(offerDialog).toBeVisible();
    }
});

Given('the offer owner is the producer', async function (){
    await expect(offerDialog.getByText("From: Producer")).toBeVisible();
});

When('the producer confirms the offer', async function () {
    // Write code here that turns the phrase above into concrete actions
    const confirmButton = offerDialog.getByRole('button', {name: 'Confirm Offer', exact: true})
    await expect(confirmButton).toBeVisible()
    await confirmButton.click({force:true, clickCount: 1})
  });

When('the producer rejects the offer', async function () {
// Write code here that turns the phrase above into concrete actions
    const rejectButton = offerDialog.getByRole('button', {name: 'Reject Offer', exact: true})
    await expect(rejectButton).toBeVisible()
    await rejectButton.click()
});

When('the producer wants to create a counteroffer', async function () {
    // Write code here that turns the phrase above into concrete actions
    const counterButton = offerDialog.getByRole('button', {name: 'Counter Offer', exact: true})
    await expect(counterButton).toBeVisible()
    await counterButton.click()

    const yesButton = offerDialog.getByRole('button',{name: 'Yes', exact:true})
    await yesButton.click()
});

Then('the producer\'s offer status is changed to {string}', async function (expectedStatus:string) {
// Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page){
        const sameOffer = page.locator('div.bg-card').filter({has: page.getByText(offerName)})
        await expect(sameOffer.locator('span.font-semibold').first()).toHaveText(expectedStatus)
    }
});
Then('the producer should be redirected to {string} page', async function (s: string)  {
    const page = customWorld.page;
    if (page) {
        await page.waitForURL(`**/${s}/**`, {waitUntil: 'domcontentloaded'});
    }
})

Then('the producer should not be able to confirm the offer', () => {
    const page = customWorld.page;
    if (page) {
        expect(offerDialog.getByRole('button', {name: 'Confirm Offer', exact: true})).toBeDisabled()
    }
})
