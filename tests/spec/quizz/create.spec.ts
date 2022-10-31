import { test, expect } from '@playwright/test'

import { CreateQuizPage } from '../../page/quizz/create'

test('Create a quiz', async ({ page }) => {
  
  const createQuizPage = new CreateQuizPage(page)
  await createQuizPage.goto()
  await expect(page).toHaveTitle('Create a quizz | Polyflix')
  
  await expect(createQuizPage.quizzNameInput).toBeVisible()
  await createQuizPage.quizzNameInput.fill('I am a quizz')

  await createQuizPage.tryAttemptInput.first().click();

  await expect(createQuizPage.firstQuestionInput).toBeVisible()
  await createQuizPage.firstQuestionInput.fill('The answer is A')

  await page.locator('input[name="questions\\.0\\.alternatives\\.0\\.isCorrect"]').check();
  await page.locator('input[name="questions\\.0\\.alternatives\\.0\\.label"]').click();
  await page.locator('input[name="questions\\.0\\.alternatives\\.0\\.label"]').fill('A');
  await page.locator('input[name="questions\\.0\\.alternatives\\.1\\.label"]').click();
  await page.locator('input[name="questions\\.0\\.alternatives\\.1\\.label"]').fill('B');
  await page.locator('input[name="questions\\.0\\.alternatives\\.2\\.label"]').click();
  await page.locator('input[name="questions\\.0\\.alternatives\\.2\\.label"]').fill('C');

  await expect(createQuizPage.AddaQuestionButton).toBeVisible()
  await createQuizPage.AddaQuestionButton.click();

  await expect(createQuizPage.secondQuestionInput).toBeVisible()
  await createQuizPage.secondQuestionInput.fill('I am a second question')

  await page.locator('input[name="questions\\.1\\.label"]').fill('The answer is D');
  await page.locator('input[name="questions\\.1\\.alternatives\\.0\\.label"]').click();
  await page.locator('input[name="questions\\.1\\.alternatives\\.0\\.label"]').fill('A');
  await page.locator('input[name="questions\\.1\\.alternatives\\.1\\.label"]').click();
  await page.locator('input[name="questions\\.1\\.alternatives\\.1\\.label"]').fill('B');
  await page.locator('input[name="questions\\.1\\.alternatives\\.2\\.label"]').click();
  await page.locator('input[name="questions\\.1\\.alternatives\\.2\\.label"]').fill('C');
  await page.locator('input[name="questions\\.1\\.alternatives\\.3\\.label"]').click();
  await page.locator('input[name="questions\\.1\\.alternatives\\.3\\.label"]').fill('D');
  await page.locator('input[name="questions\\.1\\.alternatives\\.3\\.isCorrect"]').check();

  await createQuizPage.createQuizButton.scrollIntoViewIfNeeded()
  await expect(createQuizPage.createQuizButton).toBeVisible()
  await createQuizPage.createQuizButton.click();

  await page.waitForNavigation()
  await expect(page).toHaveURL('users/profile/quizzes')

  await page.getByRole('button', { name: 'video menu' }).nth(0).click()
  await page.getByRole('menuitem', { name: 'Play' }).click()

  await expect(page).toHaveTitle('I am a quizz | Polyflix')
})
