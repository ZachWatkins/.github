import { expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import test from '../server/serverTest.js'
import build from './gh-pages.mjs'

test.beforeAll(async () => {
    build({
        assets: [
            ['node_modules/github-markdown-css/github-markdown.css', 'styles/github-markdown-css/github-markdown.css'],
            ['node_modules/github-markdown-css/license', 'styles/github-markdown-css/license'],
        ],
        markdown: [
            'README.md',
            'docs/new-repository-configuration.md',
            'contributing/development.md',
            'contributing/self-review.md',
            'contributing/types-of-contributions.md',
            'CHANGELOG.md',
            'CODE_OF_CONDUCT.md',
            'CONTRIBUTING.md',
            'LICENSE',
            'SECURITY.md',
        ],
        directory: 'gh-pages',
    })
})

test('has title', async ({ baseUrl, page }) => {
    await page.goto(baseUrl + '/')

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Index/)
})

test('has documentation link', async ({ baseUrl, page }) => {
    await page.goto(baseUrl + '/')

    // Click the get started link.
    await page.getByRole('link', { name: 'GitHub Pages' }).click()

    // Expects the URL to contain gh-pages.
    await expect(page).toHaveURL(/.*gh-pages\//)
})

test('has markdown page link', async ({ baseUrl, page }) => {
    await page.goto(baseUrl + '/gh-pages/')

    // Click the New Repository Configuration link.
    await page.getByRole('link', { name: 'New Repository Configuration' }).click()

    // Expects the URL to contain gh-pages.
    await expect(page).toHaveURL(/.*gh-pages\/new-repository-configuration\//)
})

test.describe('homepage', () => {
    test('should not have any automatically detectable accessibility issues', async ({ baseUrl, page }, testInfo) => {
        await page.goto(baseUrl + '/gh-pages/')

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
