import { Given, When, Then ,world } from '@cucumber/cucumber';
import { ICustomWorld } from '../../utils/custom-world';
import { expect} from "@playwright/test";

let customWorld: ICustomWorld = world;

Given("choose a post to view offerings", async function () {
  const page = customWorld.page;
  if (page) {
    page.waitForURL('**/my-offering', {waitUntil: 'domcontentloaded'});
    const posts = page.locator('div.cursor-pointer').filter({hasText: "View More"})
    const count = await posts.count()
    await posts.nth(Math.floor(Math.random()*count)).getByRole('link').click()
  }
});

Given("choose a post named {string}", async function (postName:string) {
  const page = customWorld.page;
  if (page) {
    page.waitForURL('**/my-offering', {waitUntil: 'domcontentloaded'});
    const targetPost = page.locator('div.cursor-pointer').filter({has: page.getByRole('heading',{name: postName, exact: true})})
    await targetPost.first().getByRole('link').click()
  }
});
