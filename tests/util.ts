import { Page } from '@playwright/test'
import config from './config'
import { LoginPage } from './page/login'

export async function login(page: Page,
                            email: string = config.user.contributor_email,
                            password: string = config.user.contributor_password) {
  await page.context().clearCookies()
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.authenticate(email, password)
  await acceptCookies(page)
}

export async function acceptCookies(page: Page) {
  await page.waitForNavigation()
  await page.getByRole('button', { name: 'Accept cookies' }).click()
}

export async function loginAsAdmin(page: Page) {
  await login(page, config.user.admin_email, config.user.admin_password)
}

export async function loginAsContributor(page: Page) {
  await login(page)
}

export async function loginAsMember(page: Page) {
  await login(page, config.user.member_email, config.user.member_password)
}