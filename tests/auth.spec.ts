import {expect, test} from "@playwright/test";
import {login} from "./utils";


const loginTests = () => {
	test("case=can log in with username / password", login)
	test("case=assert test user is member", async ({page}) => {
		await login({page})
		const role = await page.getByText("Member")
		await expect(role).toBeVisible()
	})
	test("case=can report a bug", async ({page}) => {
		await login({page})
		const reportButton = await page.locator("[aria-label='Report a bug']")
		await expect(reportButton).toBeVisible()
		await reportButton.click()
	})
	test("case=can log out", async ({page}) => {
		await login({page})
		await page.locator('[aria-label="Log out"]').hover()
		await page.locator('[aria-label="Log out"]').click()

		const signinTitle = await page.getByText("Sign in to Polyflix")
		await expect(signinTitle).toBeVisible()
	})

}

test.describe("Authentication", () => {
	test.describe("::login with user/password", loginTests)
})
