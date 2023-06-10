import { expect, beforeAll, afterAll } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import test from '../server/serverTest.js'
import build from './md-site.mjs'
import fs from 'fs'

beforeAll(async () => build({markdown: ['README.md']}))
afterAll(async () => fs.rmdir('build', {recursive: true}, () => {}))

test.describe('page', () => {
    test('has title', async ({ baseUrl, page }) => {
        await page.goto(baseUrl + '/')

        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/Index/)
    })

    test('should not have any automatically detectable accessibility issues', async ({ baseUrl, page }, testInfo) => {
        await page.goto(baseUrl + '/')

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze()

        // Attach accessibility violations to test report.
        await testInfo.attach('accessibility-scan-results', {
            body: JSON.stringify(accessibilityScanResults.violations, null, 2),
            contentType: 'application/json',
        })

        expect(accessibilityScanResults.violations).toEqual([])
    })
})
