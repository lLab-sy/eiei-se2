import { Then, world } from '@cucumber/cucumber';
import { ICustomWorld } from '../../utils/custom-world';
import { expect, Locator} from "@playwright/test";

let customWorld: ICustomWorld = world;
let reviewSection: Locator

Then("{string} should see {string} review section", async function(current:string,owner:string) {
    const page = customWorld.page
    if (page){
        await page.waitForLoadState('domcontentloaded');
        switch (owner){
            case 'their own':
                const reviewHeader = page.getByText('Your Review')
                await expect(reviewHeader).toBeVisible();
                reviewSection = page.locator('div.rounded-lg.border.bg-card.text-card-foreground').filter({has: reviewHeader}).first()
                await expect(page.getByText('Your Review')).toBeVisible();
            default:
                let expectedtext: string = ""
                switch(owner){
                    case "producer's":
                        expectedtext = "Producer's Previously Received Reviews"
                    case "production professional's":
                        expectedtext = "Previously Received Reviews"
                    default:
                        expectedtext = "Received Reviews"
                }
                expect(page.getByRole('heading',{name: expectedtext, exact: true})).not.toBeNull()
                reviewSection = page.locator('div.h-full.overflow-y-auto.scroll-p-0');
                await reviewSection.waitFor({timeout: 2000});
                expect(reviewSection).not.toBeNull();
        }
    }
});

Then('I should see at least one review', async function () {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    if (page) {
        const reviewList = reviewSection.locator('div.flex.flex-col.p-3.my-2.w-\\[97\\%\\].bg-slate-50.rounded-lg');
        reviewList.waitFor({timeout: 2000})
        console.log(await reviewList.all())
        expect(reviewList.nth(0)).not.toBeNull();
    }
  });

  Then('the reviews should be displayed correctly', async function () {
    // Write code here that turns the phrase above into concrete actions
    const page = customWorld.page;
    let numbers: string[]
    if (page)
    {
        const ratingHash: Record<string, number> = {};
        numbers = (await reviewSection.locator('div.w-\\[60\\%\\].flex.flex-col').allInnerTexts())[0].split('\n');
        let sum:number = 0;
        for (let i = 0; i < numbers.length; i += 2) {
            sum += Number(numbers[i + 1])
            ratingHash[numbers[i]] = Number(numbers[i + 1]);
            ratingHash['All'] = sum
        }
        const ratingStarSelector = reviewSection.locator('div.mt-5.flex.justify-around')  
        for(const ratingStar of await ratingStarSelector.locator('span.relative').all()){
            await ratingStar.click()
            const content = await reviewSection.locator('div.flex.flex-col.p-3.my-2.w-\\[97\\%\\].bg-slate-50.rounded-lg').all()
            expect(ratingHash[(await ratingStar.allTextContents())[0]]).toBe(content.length)
        }
        expect((await reviewSection.locator('div.w-\\[30\\%\\].items-center').allInnerTexts())[0]).toMatch(/^\d+(\.\d{1})?\nOut of 5$/)
    }
  });