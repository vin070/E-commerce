import { test, expect } from 'playwright/test'

test.describe('product sorting', () => {
    let page: any;
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        await page.goto('http://localhost:5173')
        const isSuccess = await page.waitForResponse(async (res: any) => {
            return res.request().method() === "GET" && res.url().includes('/products') && res.status() === 200
        })
    })

    test.afterAll(async () => {
        await page.close();
    });


    test('ascending order', async () => {
        await page.selectOption('[data-testid="sortContainer"]', { value: '0' });
        const priceElements = await page.locator('.price').all()
        let previousPrice = -1;
        for (const priceElement of priceElements) {
            const price = await priceElement.locator('span').nth(1).textContent() as string;
            const parsedPrice = +price;
            expect(parsedPrice).toBeGreaterThanOrEqual(previousPrice)
            previousPrice = parsedPrice;
        }
    })

    test('descending order', async () => {
        await page.selectOption('[data-testid="sortContainer"]', { value: '1' })
        const priceElements = await page.locator('.price').all()
        let previousPrice = Number.MAX_SAFE_INTEGER;
        for (const priceElement of priceElements) {
            const price = await priceElement.locator('span').nth(1).textContent() as string;
            const parsedPrice = +price;
            expect(parsedPrice).toBeLessThanOrEqual(previousPrice)
            previousPrice = parsedPrice;
        }
    })
})