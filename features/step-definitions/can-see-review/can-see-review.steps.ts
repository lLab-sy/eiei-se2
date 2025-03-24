import { Then, When, world } from '@cucumber/cucumber';
import { ICustomWorld } from '../../utils/custom-world';
import { expect, Locator} from "@playwright/test";

let customWorld: ICustomWorld = world;
let reviewSection: Locator

Then("{string} should see {string} review section", async function(current:string,owner:string) {
    const page = customWorld.page
    if (page){
        switch (owner){
            case 'their own':
                await page.waitForURL('**\/user-profile',{waitUntil: 'domcontentloaded'})
                const reviewHeader = await page.getByText('Your Review').all()
                expect(reviewHeader).not.toStrictEqual([]);
                reviewSection = page.locator('div.rounded-lg.border').filter({has: reviewHeader[0]}).first()
                //console.log('Find Review Section\n',await page.locator('div.rounded-lg.border.bg-card.text-card-foreground').filter({hasText: 'Your Review'}).all())
                await expect(page.getByText('Your Review')).toBeVisible();
                break;
            default:
                let expectedtext: string = ""
                let waitForURL:string = ''
                switch(owner){
                    case "producer's":
                        expectedtext = "Producer's Previously Received Reviews"
                        waitForURL = "**\/producer\/**"
                        break
                    case "production professional's":
                        expectedtext = "Previously Received Reviews"
                        waitForURL = "**\/professionals\/**"
                        break
                    default:
                        expectedtext = "Received Reviews"
                }
                await page.waitForURL(waitForURL,{waitUntil:'domcontentloaded'})
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
        reviewList.waitFor();
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

When('the producer has a target production professional that has {string} rating score', async (rating:string) => {
  // Write code here that turns the phrase above into concrete actions
  const page = customWorld.page;
  if (page){
    let ratingText: RegExp
    switch (rating) {
        case "no":
            ratingText = /0\.0/
            break
        default:
            ratingText = /(?!0\.0)\d\.\d/
    }
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole('banner').getByRole('button').click();
    await page.getByText("Search for Professionals").click();
    await page.waitForLoadState("domcontentloaded");
    const target = await page.locator('div.flex.flex-col.bg-white.rounded-2xl').filter({hasText: ratingText}).all()
    await target[0].getByRole('link', {name:"View More"}).click();
  }
})

Then('I should not see any review', async () => {
  // Write code here that turns the phrase above into concrete actions
  const page = customWorld.page;
    if (page) {
        const reviewList = reviewSection.locator('div.flex.flex-col.p-3.my-2.w-\\[97\\%\\].bg-slate-50.rounded-lg');
        expect(await reviewList.all()).toStrictEqual([])
        await expect(page.getByText('No Review',{exact: true})).toBeVisible();
    }
})
Then('the reviews should be empty', async () => {
  // Write code here that turns the phrase above into concrete actions
  const page = customWorld.page;
    let numbers: string[]
    if (page)
    {
        numbers = (await reviewSection.locator('div.w-\\[60\\%\\].flex.flex-col').allInnerTexts())[0].split('\n');
        for (let i = 0; i < numbers.length; i += 2) {
            expect(numbers[i+1]).toStrictEqual('0')
        }
        const ratingStarSelector = reviewSection.locator('div.mt-5.flex.justify-around')  
        for(const ratingStar of await ratingStarSelector.locator('span.relative').all()){
            await ratingStar.click();
            expect(page.locator('div.mt-5.flex').filter({hasText:'No Review'})).toBeVisible();
        }
        expect((await reviewSection.locator('div.w-\\[30\\%\\].items-center').allInnerTexts())[0]).toMatch(/0\nOut of 5$/)
    }
})
