import { Given, world } from '@cucumber/cucumber';
import { ICustomWorld } from '../../utils/custom-world';
import { expect} from "@playwright/test";

let customWorld: ICustomWorld = world;

Given("the {string} is logged in", async function (role) {
  const page = customWorld.page;
  let username : string, password : string;
  switch(role) {
    case 'producer':
      username = 'testpd1';
      password = 'testpd1@#T';
      break;
    case 'production professional':
      username = 'testpd1';
      password = 'testpd1@#T';
      break;
    default:
      username = 'norole'
      password = 'norole@#T'
  }
  if (page){
    await page.goto("/",{waitUntil: 'load', timeout: 0});
    await page.waitForLoadState("domcontentloaded");

    await page.getByRole('banner').getByRole('button').click();
    await page.getByText("Login").click();
    await page.getByRole('textbox', { name: 'username' }).fill(username);
    await page.getByRole('textbox', { name: 'password' }).fill(password);
    await page.getByRole('button', { name: 'Login'}).click()
  }
});