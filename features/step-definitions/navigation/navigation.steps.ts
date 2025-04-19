import { Given, Then, When, world } from '@cucumber/cucumber';
import { ICustomWorld } from '../../utils/custom-world';
import { expect} from "@playwright/test";
import { config } from '../../utils/config';

let customWorld: ICustomWorld = world;

Given("the {string} is logged in", async function (role:string) {
  const page = customWorld.page;
  let username : string, password : string;
  let expectedUrl: string = config.BASE_URL!
  switch(role) {
    case 'producer':
      username = 'testpd1';
      password = 'testpd1@#T';
      break;
    case 'production professional':
      username = 'testpf1';
      password = 'testpf1@#T';
      break;
    default:
      username = 'norole'
      password = 'norole@#T'
  }
  if (page){
    await page.goto("/",{waitUntil: 'load', timeout: 0});
    await page.waitForLoadState("domcontentloaded");

    await page.getByRole('banner').getByRole('button').click();
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'username' }).fill(username);
    await page.getByRole('textbox', { name: 'password' }).fill(password);
    await page.getByRole('button', { name: 'Login'}).click()
    await page.waitForURL(expectedUrl,{waitUntil:'domcontentloaded'})
  }
});

Given("I visit the home page", async function () {
  const page = customWorld.page;
  if (page){
    await page.goto("/",{waitUntil: 'domcontentloaded', timeout: 0});
  }
});

When("I visit {string}", async function (pageName:string) {
    const page = customWorld.page;
    if (page) {
        await page.getByRole('banner').getByRole('button').click();
        await page.getByRole('link', { name: pageName, exact: true }).click();
    }
});

Then("I should be on {string}", async function (pageName: string) {
    const page = customWorld.page;
    if (page) {
      let expectedUrl: string = config.BASE_URL!
      switch(pageName) {
        case "Home Page":
          expectedUrl += ""
          break
        case "Login Page":
          expectedUrl += "login"
          break
        default:
          expectedUrl += ""
      }
      await page.waitForURL(`${expectedUrl}`,{waitUntil: "load"})
      expect(page.url()).toStrictEqual(expectedUrl)
    }
})