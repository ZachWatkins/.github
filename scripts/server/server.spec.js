import { expect } from '@playwright/test'
import test from './serverTest.js'

test('server loads from localhost with a port', async ({baseUrl, page}) => {
    expect(baseUrl).toMatch(/http:\/\/localhost:\d{4}/)
    const response = await page.goto(baseUrl + '/')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toMatch(/text\/html/)
    await expect(page).toHaveTitle(/Index/)
})
