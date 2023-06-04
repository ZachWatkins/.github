import { expect } from '@playwright/test'
import test from './serverTest.js'

test('server routes to the repository\'s root folder', async ({server, page}) => {
    expect(server.listening).toBe(true)
    const response = await page.goto('http://localhost:3001')
    expect(response.status()).toBe(200)
    await expect(page).toHaveTitle(/Index/)
})
