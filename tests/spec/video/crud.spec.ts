import { test, expect } from '@playwright/test';
import { loginAsContributor, loginAsMember } from '../../util';

test.setTimeout(60000)

test('crud video as contrib, play the video as member', async ({ page }) => {
  await page.goto('/videos/create?src=File');

  // await page.locator('input[type=file]').first().click();

  await page.locator('input[type=file]').setInputFiles('tests/assets/sample-5s.mp4');

  await page.getByLabel('Title').click();

  await page.getByLabel('Title').fill('123');

  await page.getByLabel('Description').click();

  await page.getByLabel('Description').fill('123');

  await page.getByRole('button', { name: 'Screenshot' }).click();

  await page.getByRole('button', { name: 'Create video' }).click();
  await expect(page).toHaveURL('/videos/explore');

  await page.getByRole('button', { name: 'Videos' }).click();

  await page.getByRole('link', { name: 'My videos' }).click();
  await expect(page).toHaveURL('/users/profile/videos');

  await page.getByRole('button', { name: 'video menu' }).click();

  await page.getByRole('menuitem', { name: 'Update' }).click();

  // get the video slug from current url '/videos/slug/update'

  const video_slug = page.url().split('/')[4];

  await page.getByLabel('Description').click();

  await page.getByLabel('Description').fill('12345');

  await page.getByLabel('Title').click();

  await page.getByLabel('Title').fill('12345');

  await page.getByRole('button', { name: 'Update video' }).click();

  await page.getByRole('button', { name: 'Screenshot' }).click();

  await page.getByRole('button', { name: 'Update video' }).click();
  await expect(page).toHaveURL('/videos/explore');

  await loginAsMember(page);

  console.log('video_slug', video_slug);
  await page.goto(`/videos/${video_slug}`);

  // 12345 should be present on the page

  await expect(page).toHaveTitle('12345 | Polyflix')

  await loginAsContributor(page);

  await page.goto('/users/profile/videos');

  await page.getByRole('button', { name: 'video menu' }).click();

  await page.getByRole('menuitem', { name: 'Delete' }).locator('div').first().click();

  await page.getByRole('button', { name: 'Delete' }).click();

});