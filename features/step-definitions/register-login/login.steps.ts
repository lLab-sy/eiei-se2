import { When, world } from '@cucumber/cucumber';
import { ICustomWorld } from '../../utils/custom-world';

let customWorld: ICustomWorld = world;

When("I login", async function () {
    const page = customWorld.page;
    if (page) {
        await page.waitForLoadState("domcontentloaded");
        await page.getByRole('button', {name: "Login"}).click();
    }
});