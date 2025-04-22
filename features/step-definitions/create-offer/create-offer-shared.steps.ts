import { Then, When, world } from "@cucumber/cucumber";
import { ICustomWorld } from "../../utils/custom-world";
import { expect } from "@playwright/test";

let customWorld: ICustomWorld = world;

When('{string} button is clicked',async function (string:string) {
    const page = customWorld.page;
    if (page){
        await page.getByRole('button',{name: string}).click();
        await page.getByRole('button',{name: "Confirm"}).click();
    }
})
Then('ensure the system displays status message {string}', (string: string) => {
  // Write code here that turns the phrase above into concrete actions
  const page = customWorld.page;
  if (page){
    const successMessage = page.getByText(string, {exact: true})
    expect(successMessage).toBeVisible();
  }
})


Then('ensure the system sends a message failed that {string}.', async function (string) {
  const page = customWorld.page;
  if (page){
    await expect(page.getByText(string)).toBeVisible();
  }
});