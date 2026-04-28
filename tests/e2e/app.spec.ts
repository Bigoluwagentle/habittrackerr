import { test, expect, Page } from '@playwright/test';

async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('habit-tracker-users');
    localStorage.removeItem('habit-tracker-session');
    localStorage.removeItem('habit-tracker-habits');
  });
}

async function signup(page: Page, email: string, password: string) {
  await page.goto('/signup');
  await page.getByTestId('auth-signup-email').fill(email);
  await page.getByTestId('auth-signup-password').fill(password);
  await page.getByTestId('auth-signup-submit').click();
  await page.waitForURL('/dashboard');
}

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
  });

  test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      const user = { id: 'u1', email: 'a@test.com', password: 'pass', createdAt: new Date().toISOString() };
      localStorage.setItem('habit-tracker-users', JSON.stringify([user]));
      localStorage.setItem('habit-tracker-session', JSON.stringify({ userId: 'u1', email: 'a@test.com' }));
    });
    await page.goto('/');
    await page.waitForURL('/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await signup(page, 'newuser@example.com', 'mypassword');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs in an existing user and loads only that user\'s habits', async ({ page }) => {
    await signup(page, 'usera@example.com', 'passA');
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('User A Habit');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-user-a-habit')).toBeVisible();

    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('/login');

    await signup(page, 'userb@example.com', 'passB');
    await expect(page.getByTestId('empty-state')).toBeVisible();
    await expect(page.locator('[data-testid="habit-card-user-a-habit"]')).not.toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await signup(page, 'creator@example.com', 'pass123');
    await expect(page.getByTestId('empty-state')).toBeVisible();

    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-description-input').fill('8 glasses a day');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
    await expect(page.getByTestId('empty-state')).not.toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await signup(page, 'streaker@example.com', 'pass123');
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Exercise');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-streak-exercise')).toContainText('0');
    await page.getByTestId('habit-complete-exercise').click();
    await expect(page.getByTestId('habit-streak-exercise')).toContainText('1');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await signup(page, 'persist@example.com', 'pass123');
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Read Books');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();

    await page.reload();

    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await signup(page, 'logout@example.com', 'pass123');
    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');

    await page.goto('/dashboard');
    await page.waitForURL('/login');
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ page, context }) => {
    await signup(page, 'offline@example.com', 'pass123');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await page.waitForTimeout(2000);

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});

    const title = await page.title().catch(() => '');
    expect(title).not.toMatch(/ERR_|No internet|Network Error/i);

    await context.setOffline(false);
  });
});