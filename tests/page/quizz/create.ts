import { Locator, Page } from '@playwright/test'

export class CreateQuizPage {
  readonly page: Page
  readonly quizzNameInput: Locator
  readonly tryAttemptInput: Locator
  readonly firstQuestionInput: Locator
  readonly secondQuestionInput: Locator
  readonly AddaQuestionButton: Locator
  readonly createQuizButton: Locator


  constructor(page: Page) {
    this.page = page
    this.quizzNameInput = page.getByLabel('Name')
    this.tryAttemptInput = page.getByText('2')
    this.firstQuestionInput = page.getByLabel('Question')
    this.secondQuestionInput = page.locator('input[name="questions\\.1\\.label"]')
    this.AddaQuestionButton = page.getByRole('button', { name: 'Add a question' })
    this.createQuizButton = page.getByRole('button', { name: 'Create the quizz' })
  }

  async goto() {
    await this.page.goto('quizzes/create')
  }
}
