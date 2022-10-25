import { Page } from '@playwright/test'
import config from './config'
import { LoginPage } from './page/login'

export async function login(page: Page) {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.authenticate(config.user.email, config.user.password)
}
