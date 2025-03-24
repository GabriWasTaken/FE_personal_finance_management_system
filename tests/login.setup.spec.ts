import { test, expect } from '@playwright/test';

test('perform login', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByTestId('loader')).toBeVisible();
  await expect(page.getByTestId('loader')).not.toBeVisible();
  await expect(page.getByRole('textbox').nth(1)).toBeVisible({timeout: 20000});

  await page.getByRole('textbox').nth(0).fill('gabrieletorta@gmail.com');
  await page.getByRole('textbox').nth(1).fill('C6HmEjcp');

  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByTestId('topbar')).toBeVisible();
});