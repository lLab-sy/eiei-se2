import puppeteer from "puppeteer";
import { Browser } from "puppeteer"
import { ICustomWorld } from "./custom-world";
import {
    After,
    AfterAll,
    Before,
    BeforeAll,
    setDefaultTimeout,
  } from "@cucumber/cucumber";

let browser: Browser;

setDefaultTimeout(60000);

BeforeAll(async function () {
    browser = await puppeteer.launch({headless: false})
  });

Before(async function (this: ICustomWorld) {
    this.context = await browser.createBrowserContext();
    this.page = await this.context.newPage()
    this.page.setDefaultNavigationTimeout(60000);
    this.page.setDefaultTimeout(60000);
});

After(async function (this: ICustomWorld, { pickle, result }) {
    if (result) {
      let nanoSeconds = result.duration.nanos;
      let milliseconds = nanoSeconds / Math.pow(10, 6);
      this.attach(
        `Status: ${result.status}. Duration: ${milliseconds} milliseconds`
      );
    }
    console.log("Finished scenario: ", pickle.name);
    await this.page?.close();
    await this.context?.close();
  });

AfterAll(async function () {
    await browser.close();
  });
