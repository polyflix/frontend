import {expect, Page} from "@playwright/test";

export const login = async ({page}: { page: Page }) => {
	await page.goto("https://qapolyflix.dopolytech.fr")

	await page.locator("#username").fill("qapolyflix@yopmail.fr")
	await page.locator("#password").fill("12345678")

	await page.locator("#mui-3").click()

	const username = page.getByText("John Doe")
	await expect(username, "user should be on home page").toBeVisible()
	await expect(page.url()).toBe("https://qapolyflix.dopolytech.fr/")

	const cookieButton = await page.getByRole("button").getByText("Accept cookies")
	await expect(cookieButton).toBeVisible()
	await cookieButton.click()
}
