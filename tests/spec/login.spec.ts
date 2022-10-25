import { test, expect } from '@playwright/test'

import config from '../config'
import { LoginPage } from '../page/login'

test('Logs in', async ({ page }) => {
  await page.context().clearCookies()
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await expect(loginPage.emailInput).toBeVisible()
  await loginPage.emailInput.fill(config.user.email)
  await expect(loginPage.passwordInput).toBeVisible()
  await loginPage.passwordInput.fill(config.user.password)
  await loginPage.passwordInput.press('Enter')
  await page.waitForNavigation()
  await expect(page).toHaveURL(config.url)
  await page.getByRole('button', { name: 'Accept cookies' }).click()
  await expect(page).toHaveTitle('Home | Polyflix')
})
