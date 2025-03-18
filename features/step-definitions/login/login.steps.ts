import { Given, When, Then, setDefaultTimeout, world } from '@cucumber/cucumber';
import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';
import { ICustomWorld } from '../../utils/custom-world';
import assert from "assert";

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
    await page.goto("http://localhost:3000/",{waitUntil: 'load', timeout: 0});
    await page.waitForSelector('button.p-2.hover\\:bg-blue-800');
    await page.click('button.p-2.hover\\:bg-blue-800');
    // await page.$eval(`a[href='/login']`, element => element.click());
    await Promise.all([
        page.waitForNavigation({waitUntil: 'load', timeout: 0}), 
        await page.$eval(`a[href='/login']`, element => element.click())
      ]);
      await page.waitForSelector('input[name="username"]');
      await page.type('input[name="username"]', username, {delay: 50});
  
      await page.waitForSelector('input[name="password"]');
      await page.type('input[name="password"]', password, {delay: 50});
  
      await Promise.all([
        page.waitForNavigation(), 
        await page.click('[type="submit"]')
      ]);
  }
});