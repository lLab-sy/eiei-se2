import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import puppeteer, { Browser, Page, BrowserContext } from "puppeteer";

export interface ICustomWorld extends World {
  context?: BrowserContext;
  page?: Page;
}

/// Custom World class for managing Puppeteer browser and page instances
export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);