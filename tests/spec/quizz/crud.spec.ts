import { test, expect } from '@playwright/test'


test('crud quizz as admin', async ({ page }) => {
    await page.goto('quizzes/create')
    await expect(page).toHaveURL('quizzes/create');
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill('test');
    await page.getByLabel('Question').click();
    await page.getByLabel('Question').fill('test');
    await page.locator('input[name="questions\\.0\\.alternatives\\.0\\.isCorrect"]').check();
    await page.locator('input[name="questions\\.0\\.alternatives\\.1\\.label"]').fill('t');
    await page.locator('input[name="questions\\.0\\.alternatives\\.1\\.label"]').click();
    await page.locator('input[name="questions\\.0\\.alternatives\\.1\\.label"]').fill('test');
    await page.getByRole('button', { name: 'Create the quizz' }).click();
    await page.locator('input[name="questions\\.0\\.alternatives\\.0\\.label"]').fill('test');
    await page.getByRole('button', { name: 'Create the quizz' }).click();
    await expect(page).toHaveURL('users/profile/quizzes');
    await page.getByRole('button', { name: 'video menu' }).click();
    await page.getByRole('menuitem', { name: 'Update' }).click();
    await page.getByLabel('Question').click();
    await page.getByLabel('Question').fill('testsss');
    await page.getByRole('button', { name: 'Update the quizz' }).click();
    await expect(page).toHaveURL('users/profile/quizzes');
    await page.getByRole('button', { name: 'video menu' }).click();
    await page.getByRole('menuitem', { name: 'Play' }).click();
    await page.getByRole('button', { name: 'Go !' }).click();
    await page.getByRole('button', { name: 'test' }).first().click();
    await page.getByRole('button', { name: 'Terminate the quizz' }).click();
    await page.getByRole('button', { name: 'Validate' }).click();
    await page.goto('users/profile/quizzes')
    await expect(page).toHaveURL('users/profile/quizzes');
    await page.getByRole('button', { name: 'video menu' }).click();
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
  });