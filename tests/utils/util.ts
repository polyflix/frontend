import { Page } from '@playwright/test'
import config from '../config'
import { LoginPage } from '../page/login'

export async function login(page: Page,
                            email: string = config.user.contributor_email,
                            password: string = config.user.contributor_password) {
  await page.context().clearCookies()
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  if (email === 'user@example') {
    return
  }
  await loginPage.authenticate(email, password)
  await acceptCookies(page)
}

export async function acceptCookies(page: Page) {
  await page.waitForNavigation()
  try {
    await page.getByRole('button', { name: 'Accept cookies' }).click()
  }
  catch (e) {
    // Ignore
  }
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

export async function createAccount(page: Page, firstname: string, lastname: string, email: string, password: string) {
  await page.goto('auth/login');
  await page.getByRole('link', { name: 'Get started' }).click();
  await page.locator('input[name="firstName"]').fill(firstname);
  await page.locator('input[name="firstName"]').press('Tab');
  await page.getByLabel('Lastname').fill(lastname);
  await page.getByLabel('Lastname').press('Tab');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Email address').press('Tab');
  await page.getByRole('textbox', { name: 'New password' }).fill(password);
  await page.getByRole('textbox', { name: 'New password' }).press('Tab');
  await page.getByRole('button').nth(2).press('Tab');
  await page.getByLabel('Confirm new password').fill(password);
  await page.getByLabel('Confirm new password').click();
  await page.getByRole('button', { name: 'Register' }).click();
}