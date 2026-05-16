import { test, expect } from '@playwright/test';

const TECHNICIAN_USERNAME =
  process.env.E2E_TECHNICIAN_USERNAME ?? 'technician';
const TECHNICIAN_PASSWORD =
  process.env.E2E_TECHNICIAN_PASSWORD ?? 'Technician123!';

test.describe('Accueil technicien', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.getByPlaceholder("Votre nom d'utilisateur").fill(TECHNICIAN_USERNAME);
    await page.getByPlaceholder('Votre mot de passe').fill(TECHNICIAN_PASSWORD);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 });
  });

  test('affiche les 7 cartes de navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: /top chantiers/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /chantiers en cours/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /chantiers terminés/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /documents officiels/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /habilitations/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /véhicule/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /urgence/i })).toBeVisible();
  });

  test('la salutation contient le nom de l\'utilisateur', async ({ page }) => {
    await expect(
      page.getByText(new RegExp(`bonjour.*${TECHNICIAN_USERNAME}`, 'i'))
    ).toBeVisible();
  });

  test('navigation vers Top Chantiers', async ({ page }) => {
    await page.getByRole('link', { name: /top chantiers/i }).click();

    await expect(page).toHaveURL('/dashboard/technician/top-chantiers');
    await expect(
      page.getByRole('heading', { name: /top chantiers/i })
    ).toBeVisible();
  });

  test('navigation vers Chantiers en cours', async ({ page }) => {
    await page.getByRole('link', { name: /chantiers en cours/i }).click();

    await expect(page).toHaveURL('/dashboard/technician/derivations');
    await expect(
      page.getByRole('heading', { name: /chantiers en cours/i })
    ).toBeVisible();
  });

  test('navigation vers Chantiers terminés', async ({ page }) => {
    await page.getByRole('link', { name: /chantiers terminés/i }).click();

    await expect(page).toHaveURL(
      '/dashboard/technician/derivations/complete'
    );
  });

  test('navigation vers Mes documents officiels', async ({ page }) => {
    await page.getByRole('link', { name: /documents officiels/i }).click();

    await expect(page).toHaveURL('/dashboard/technician/documents');
    await expect(
      page.getByRole('heading', { name: /documents officiels/i })
    ).toBeVisible();
  });

  test('navigation vers Mes habilitations', async ({ page }) => {
    await page.getByRole('link', { name: /habilitations/i }).click();

    await expect(page).toHaveURL('/dashboard/technician/habilitations');
    await expect(
      page.getByRole('heading', { name: /habilitations/i })
    ).toBeVisible();
  });

  test('navigation vers Mon véhicule', async ({ page }) => {
    await page.getByRole('link', { name: /véhicule/i }).click();

    await expect(page).toHaveURL('/dashboard/technician/vehicule');
    await expect(
      page.getByRole('heading', { name: /véhicule/i })
    ).toBeVisible();
  });

  test('navigation vers Numéros d\'urgence', async ({ page }) => {
    await page.getByRole('link', { name: /urgence/i }).click();

    await expect(page).toHaveURL('/dashboard/technician/urgences');
    await expect(
      page.getByRole('heading', { name: /urgence/i })
    ).toBeVisible();
  });

  test("retour au dashboard depuis une sous-page via le logo", async ({
    page,
  }) => {
    await page.getByRole('link', { name: /urgence/i }).click();
    await expect(page).toHaveURL('/dashboard/technician/urgences');

    await page.getByRole('link', { name: /tableau de bord/i }).click();
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Page Numéros d\'urgence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
    await page.getByPlaceholder("Votre nom d'utilisateur").fill(TECHNICIAN_USERNAME);
    await page.getByPlaceholder('Votre mot de passe').fill(TECHNICIAN_PASSWORD);
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 });
    await page.goto('/dashboard/technician/urgences');
  });

  test('affiche les 4 contacts d\'urgence', async ({ page }) => {
    await expect(page.getByRole('link', { name: /samu/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /police/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /pompiers/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /européen/i })).toBeVisible();
  });

  test('chaque contact affiche son numéro', async ({ page }) => {
    await expect(page.getByText('15')).toBeVisible();
    await expect(page.getByText('17')).toBeVisible();
    await expect(page.getByText('18')).toBeVisible();
    await expect(page.getByText('112')).toBeVisible();
  });

  test('les liens sont des liens téléphoniques (tel:)', async ({ page }) => {
    const samuLink = page.getByRole('link', { name: /samu/i });
    await expect(samuLink).toHaveAttribute('href', 'tel:15');

    const pompiers = page.getByRole('link', { name: /pompiers/i });
    await expect(pompiers).toHaveAttribute('href', 'tel:18');

    const europeen = page.getByRole('link', { name: /européen/i });
    await expect(europeen).toHaveAttribute('href', 'tel:112');
  });

  test("accès direct sans token redirige vers /auth", async ({ page: unauthPage, browser }) => {
    const context = await browser.newContext();
    const freshPage = await context.newPage();

    await freshPage.goto('/dashboard/technician/urgences');

    await expect(freshPage).toHaveURL(/\/auth/, { timeout: 5_000 });
    await context.close();
  });
});
