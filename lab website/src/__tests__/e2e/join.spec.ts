import { test, expect } from '@playwright/test';

test.describe('Join Lab Form E2E Tests', () => {
    test('should successfully submit the form with all fields completed', async ({ page }) => {
        await page.goto('/join');

        // Verify page loads and has header
        await expect(page.locator('h1')).toContainText('Join the Lab');

        // Fill form fields
        await page.fill('#name', 'Jane Doe');
        await page.fill('#email', 'jane.doe@university.edu');
        await page.fill('#city', 'Horizon City');
        await page.fill('#state', 'Texas');
        await page.fill('#country', 'USA');
        await page.fill('#institute', 'Horizon Biotech Institute');
        await page.fill('#position', 'Postdoctoral Researcher');
        await page.selectOption('#period', '6 Months');
        await page.fill('#joinDate', '2026-06-01');
        await page.fill('#endDate', '2026-12-01');
        await page.fill('#topic', 'Investigation of herbal transcriptome changes under dry environments.');

        // Verify CV upload interaction using FileChooser
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('.upload-box').click();
        const fileChooser = await fileChooserPromise;
        
        // Upload mock PDF file content
        await fileChooser.setFiles({
            name: 'resume.pdf',
            mimeType: 'application/pdf',
            buffer: Buffer.from('%PDF-1.4 mock pdf content')
        });

        // Verify upload display updates
        await expect(page.locator('.upload-box')).toContainText('resume.pdf');

        // Submit form
        await page.click('button[type="submit"]');

        // Success Toast check
        const successToast = page.locator('.toast-success');
        await expect(successToast).toBeVisible({ timeout: 10000 });
        await expect(successToast).toContainText('Application successfully submitted');
    });

    test('should validate input constraints and display validation errors', async ({ page }) => {
        await page.goto('/join');

        // Test invalid data submissions
        await page.fill('#name', 'Ab'); // less than 3 characters
        await page.fill('#email', 'invalid-email'); // bad format
        
        await page.click('button[type="submit"]');

        // Verify validation messages are displayed
        await expect(page.locator('text=Name must be at least 3 characters')).toBeVisible();
        await expect(page.locator('text=Please enter a valid institutional email')).toBeVisible();
    });
});
