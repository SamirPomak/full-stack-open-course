const { test, describe, expect, beforeEach } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');

    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'test_user',
        password: 'testingPlaywright',
      },
    });

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'login' });
    await loginButton.click();
    await expect(page.getByTestId('username')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test_user', 'testingPlaywright');
      await expect(page.getByText('test_user logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'test_user', 'wrongPass');
      await expect(page.getByText('wrong username or password')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test_user', 'testingPlaywright');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Blog', 'Test USER', 'test.com');
      await expect(page.getByText('Test Blog Test USER')).toBeVisible();
    });
  });

  describe('When user creates a blog', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test_user', 'testingPlaywright');
      await createBlog(page, 'Test Blog', 'Test USER', 'test.com');
    });

    test('the blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click();
      await page.getByRole('button', { name: 'like' }).click();
      await expect(page.getByTestId('likes')).toContainText('1');
    });

    test('the blog can be deleted by user who created it', async ({ page }) => {
      page.on('dialog', (dialog) => dialog.accept());
      await page.getByRole('button', { name: 'view' }).click();
      await page.getByRole('button', { name: 'remove' }).click();
      await expect(
        page.getByText('Removed blog Test Blog by Test USER')
      ).toBeVisible();
    });

    test('only user who added the blog can see remove button', async ({
      page,
      request,
    }) => {
      await request.post('/api/users', {
        data: {
          name: 'Test User2',
          username: 'test_user2',
          password: 'testingPlaywright2',
        },
      });
      await page.getByRole('button', { name: 'logout' }).click();
      await loginWith(page, 'test_user2', 'testingPlaywright2');
      await createBlog(page, 'Test Blog2', 'Test USER2', 'test2.com');
      await page.getByRole('button', { name: 'view' }).click();
      await expect(
        page
          .locator('.blog-item')
          .nth(0)
          .getByRole('button', { name: 'remove' })
      ).not.toBeVisible();
      await page
        .locator('.blog-item')
        .nth(1)
        .getByRole('button', { name: 'view' })
        .click();
      await expect(
        page
          .locator('.blog-item')
          .nth(1)
          .getByRole('button', { name: 'remove' })
      ).toBeVisible();
    });

    test('blogs are arranged in the order according to the likes, blog with most likes first', async ({
      page,
    }) => {
      // create 2 more blogs so there are 3 total and like the first two
      await page.getByRole('button', { name: 'view' }).click();
      await page.getByRole('button', { name: 'like' }).click();
      await expect(page.getByTestId('likes')).toContainText('1');
      await page.getByRole('button', { name: 'like' }).click();
      await expect(page.getByTestId('likes')).toContainText('2');
      await page.getByRole('button', { name: 'like' }).click();
      await expect(page.getByTestId('likes')).toContainText('3');
      await createBlog(page, 'Test Blog2', 'Test USER2', 'test2.com');
      await createBlog(page, 'Test Blog3', 'Test USER3', 'test3.com');
      await page
        .locator('.blog-item')
        .nth(1)
        .getByRole('button', { name: 'view' })
        .click();
      await page
        .locator('.blog-item')
        .nth(1)
        .getByRole('button', { name: 'like' })
        .click();
      await expect(
        page.locator('.blog-item').nth(1).getByTestId('likes')
      ).toContainText('1');
      await page
        .locator('.blog-item')
        .nth(1)
        .getByRole('button', { name: 'like' })
        .click();

      // get blogs in order starting by first one in list  and check their likes
      await expect(
        page.locator('.blog-item').nth(0).getByTestId('likes')
      ).toContainText('3');
      await expect(
        page.locator('.blog-item').nth(1).getByTestId('likes')
      ).toContainText('2');
      await page
        .locator('.blog-item')
        .nth(2)
        .getByRole('button', { name: 'view' })
        .click();
      await expect(
        page.locator('.blog-item').nth(2).getByTestId('likes')
      ).toContainText('0');
    });
  });
});
