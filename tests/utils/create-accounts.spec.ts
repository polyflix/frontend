import { test, expect } from '@playwright/test';
import { acceptCookies, createAccount } from './util';

test.setTimeout(30000)

test('create account member@polyflix.org', async ({ page }) => {
    await create(page, 'member', 'member', 'member@polyflix.org', 'A1member@polyflix.org');
});

test('create account contributor@polyflix.org', async ({ page }) => {
    await create(page, 'contributor', 'contributor', 'contributor@polyflix.org', 'A1contributor@polyflix.org');
    
});

test('create account administrator@polyflix.org', async ({ page }) => {
    await create(page, 'administrator', 'administrator', 'administrator@polyflix.org', 'A1administrator@polyflix.org');
});

async function create(page, firstname, lastname, email, password) {
    await createAccount(page, firstname, lastname, email, password);
    await page.waitForNavigation();
    await acceptCookies(page);
    await expect(page).toHaveTitle('Home | Polyflix')
}
