import { test, expect } from '@playwright/test';

test.describe('Flow de connexion', () => {
  test('redirige vers /dashboard après une connexion réussie', async ({
    page,
  }) => {
    await page.goto('/auth');

    await expect(page).toHaveURL('/auth');

    await page
      .getByPlaceholder("Votre nom d'utilisateur")
      .fill(process.env.E2E_USERNAME ?? 'admin');

    await page
      .getByPlaceholder('Votre mot de passe')
      .fill(process.env.E2E_PASSWORD ?? 'Admin123!');

    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 });
  });

  test('affiche un message d\'erreur avec des identifiants incorrects', async ({
    page,
  }) => {
    await page.goto('/auth');

    await page
      .getByPlaceholder("Votre nom d'utilisateur")
      .fill('utilisateur-invalide');

    await page
      .getByPlaceholder('Votre mot de passe')
      .fill('mauvais-mot-de-passe');

    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page.getByText(/incorrect/i)).toBeVisible({ timeout: 5_000 });
    await expect(page).toHaveURL('/auth');
  });

  test('redirige vers /dashboard si déjà authentifié', async ({ page }) => {
    await page.goto('/auth');

    await page
      .getByPlaceholder("Votre nom d'utilisateur")
      .fill(process.env.E2E_USERNAME ?? 'admin');
    await page
      .getByPlaceholder('Votre mot de passe')
      .fill(process.env.E2E_PASSWORD ?? 'Admin123!');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 });

    await page.goto('/auth');
    await expect(page).toHaveURL('/dashboard', { timeout: 5_000 });
  });
});
