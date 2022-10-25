import { Locator, Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.locator('#username')
    this.passwordInput = page.locator('#password')
  }

  async goto() {
    await this.page.goto('auth/login')
  }

  async authenticate(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.passwordInput.press('Enter')
  }
}
