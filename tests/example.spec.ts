import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Index/);
});

test('has documentation link', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click the get started link.
    await page.getByRole('link', { name: 'GitHub Pages' }).click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*gh-pages/);
});
