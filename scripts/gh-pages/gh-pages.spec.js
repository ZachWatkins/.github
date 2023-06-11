import { expect, test } from '@playwright/test'
import fs from 'fs'
import AxeBuilder from '@axe-core/playwright'
import build from './gh-pages.mjs'

const cwd = process.cwd()

test.beforeAll(async ({}, testInfo) => { // eslint-disable-line no-empty-pattern
    await build({
        assets: [
            ['node_modules/github-markdown-css/github-markdown.css', 'styles/github-markdown-css/github-markdown.css'],
        ],
        markdown: ['README.md', 'LICENSE', 'SECURITY.md'],
        directory: '_gh-pages-test' + testInfo.workerIndex,
    })
})

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(`file://${cwd}/_gh-pages-test${testInfo.workerIndex}/index.html`)
})

test.afterAll(async ({}, testInfo) => { // eslint-disable-line no-empty-pattern
    fs.rm(`_gh-pages-test${testInfo.workerIndex}`, {recursive: true}, (err) => err ? console.error(err) : null)
})

test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/[a-zA-Z\s]+/)
})

test('has documentation link', async ({ page }) => {
    // Click the get started link.
    await page.getByRole('link', { name: 'GitHub Pages' }).click()

    // Expects the URL to contain gh-pages.
    await expect(page).toHaveURL(/.*gh-pages\//)
})

test('has markdown page link', async ({ page }) => {
    // Click the New Repository Configuration link.
    await page.getByRole('link', { name: 'New Repository Configuration' }).click()

    // Expects the URL to contain gh-pages.
    await expect(page).toHaveURL(/.*gh-pages\/new-repository-configuration\//)
})

test.describe('homepage', () => {
    test('should not have any automatically detectable accessibility issues', async ({ page }, testInfo) => {
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
