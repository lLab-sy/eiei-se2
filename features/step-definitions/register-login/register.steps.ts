import { Given, Then, When, world } from '@cucumber/cucumber';
import { ICustomWorld } from '../../utils/custom-world';
import { expect} from "@playwright/test";

let customWorld: ICustomWorld = world;

Given('I want to register', async function()  {
    const page = customWorld.page;
    if (page) {
        await page.getByRole('link', { name: "Register", exact: true }).click();
        await page.waitForURL("/register",{waitUntil:'domcontentloaded'})
    }
  })

  Given('I want to login', async function()  {
    const page = customWorld.page;
    if (page) {
        await page.getByRole('main').getByRole('link', { name: 'Login' }).click();
        await page.waitForURL("/login",{waitUntil:'domcontentloaded'})
    }
  })

When("I put {string} into {string} box", async function (value:string, boxName: string) {
    const page = customWorld.page;
    if (page) {
        await page.getByRole('textbox', { name: boxName, exact: true }).fill(value);
    }
});

When("I choose to register as a {string}", async function (role: string) {
    const page = customWorld.page;
    if (page) {
        let roleName: string = "";
        switch(role){
            case "Producer":
                roleName = "Producer"
                break
            case "Production Professional":
                roleName = "Professional"
                break
        }
        await page.getByRole('radio', {name: roleName}).click()
    }
});

Then('I should see {string}', async function (expectText: string) {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        await expect(page.getByText(expectText).first()).toBeVisible()
    }
  });