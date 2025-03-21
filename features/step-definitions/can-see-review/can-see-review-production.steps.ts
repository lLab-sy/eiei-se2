import { Then, world } from '@cucumber/cucumber';
import { ICustomWorld } from '../../utils/custom-world';
import { expect, Locator} from "@playwright/test";

let customWorld: ICustomWorld = world;
let reviewSection: Locator

Then("I should see my review section", async function() {
    const page = customWorld.page
    if (page){
        await page.waitForURL('**/user-profile');
        await page.waitForLoadState('domcontentloaded');

        await page.locator('div.flex.flex-col.p-3.my-2.w-\\[97\\%\\].bg-slate-50.rounded-lg').waitFor();
        reviewSection = page.locator('div.rounded-lg.border.bg-card.text-card-foreground').nth(2)
        expect(reviewSection).toContainText('Your Review')
        // console.log(reviewSection)

        //console.log(await(reviewSection[2].allInnerTexts()))

        
        // const reviewList = page.locator('div.flex.flex-col.p-3.my-2.w-\\[97\\%\\].bg-slate-50.rounded-lg');
        // expect(reviewList.nth(0)).not.toBeNull();

        // const numbers = (await page.locator('div.w-\\[60\\%\\].flex.flex-col').allInnerTexts())[0].split('\n');
        // const ratingHash: Record<string, number> = {};
        // let sum:number = 0;
        // // Populate the hash
        // for (let i = 0; i < numbers.length; i += 2) {
        //     sum += Number(numbers[i + 1])
        //     ratingHash[numbers[i]] = Number(numbers[i + 1]);
        // }
        // ratingHash['All'] = sum
        // const ratingStarSelector = page.locator('div.mt-5.flex.justify-around')  
        // for(const ratingStar of await ratingStarSelector.locator('span.relative').all()){
        //     await ratingStar.click()
        //     const content = await page.locator('div.flex.flex-col.p-3.my-2.w-\\[97\\%\\].bg-slate-50.rounded-lg').all()
        //     expect(ratingHash[(await ratingStar.allTextContents())[0]]).toBe(content.length)
        // }

        // expect((await page.locator('div.w-\\[30\\%\\].items-center').allInnerTexts())[0]).toMatch(/^\d+(\.\d{1})?\nOut of 5$/)

    }
})

Then('I should see at least one review', async function () {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        const reviewList = page.locator('div.flex.flex-col.p-3.my-2.w-\\[97\\%\\].bg-slate-50.rounded-lg');
        expect(reviewList.nth(0)).not.toBeNull();
    }
  });

  Then('reviews should be displayed correctly', async function () {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page)
    {    
        const numbers = (await reviewSection.locator('div.w-\\[60\\%\\].flex.flex-col').allInnerTexts())[0].split('\n');
        const ratingHash: Record<string, number> = {};
        let sum:number = 0;
        // Populate the hash
        for (let i = 0; i < numbers.length; i += 2) {
            sum += Number(numbers[i + 1])
            ratingHash[numbers[i]] = Number(numbers[i + 1]);
        }
        ratingHash['All'] = sum
        const ratingStarSelector = reviewSection.locator('div.mt-5.flex.justify-around')  
        for(const ratingStar of await ratingStarSelector.locator('span.relative').all()){
            await ratingStar.click()
            const content = await reviewSection.locator('div.flex.flex-col.p-3.my-2.w-\\[97\\%\\].bg-slate-50.rounded-lg').all()
            expect(ratingHash[(await ratingStar.allTextContents())[0]]).toBe(content.length)
        }

        expect((await reviewSection.locator('div.w-\\[30\\%\\].items-center').allInnerTexts())[0]).toMatch(/^\d+(\.\d{1})?\nOut of 5$/)
    }
  });