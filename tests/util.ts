import { Page } from '@playwright/test'
import config from './config'
import { LoginPage } from './page/login'

export async function login(page: Page) {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.authenticate(config.user.contributor_email, config.user.contributor_password)
  await acceptCookies(page)
}

export async function acceptCookies(page: Page) {
  await page.waitForNavigation()
  await page.getByRole('button', { name: 'Accept cookies' }).click()
}