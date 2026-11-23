import type { Metadata } from 'next';
import { ShieldCheck, Smartphone, Zap } from 'lucide-react';
import { LoginForm } from '@/features/auth';
import { BrandLogo, BrandMark } from '@/shared/ui/brand-logo';

export const metadata: Metadata = {
  title: 'Connexion',
};

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: 'Relevés de dérivation',
    description: 'Saisissez vos relevés terrain en quelques étapes.',
  },
  {
    icon: ShieldCheck,
    title: 'Habilitations à jour',
    description: 'Documents et validités suivis en temps réel.',
  },
  {
    icon: Smartphone,
    title: 'Pensé pour le terrain',
    description: 'Une expérience fluide sur mobile comme sur ordinateur.',
  },
];

export default function AuthPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 size-[560px] rounded-full border-[28px] border-primary/90"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-28 size-56 rounded-full bg-primary blur-[1px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgb(var(--brand-600)/0.25),transparent_60%)]"
        />

        <div className="relative flex items-center gap-3">
          <BrandMark className="size-10 [&_circle:first-child]:stroke-white" />
          <span className="text-lg font-semibold uppercase tracking-[0.2em]">
            Abrisûr
          </span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Vos chantiers, pilotés en toute sérénité.
          </h2>
          <p className="mt-4 text-base text-white/70">
            La plateforme qui réunit techniciens, chefs de chantier et
            encadrants autour des mêmes données.
          </p>
          <ul className="mt-10 space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="block text-sm text-white/60">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} Abrisûr. Tous droits réservés.
        </p>
      </aside>

      <section className="flex flex-col items-center justify-center bg-background px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm animate-fade-in-up">
          <BrandLogo
            className="mb-10 lg:hidden"
            markClassName="size-10"
            caption="Gestion des chantiers"
          />
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Bon retour 👋
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Connectez-vous pour accéder à votre espace.
            </p>
          </div>
          <LoginForm />
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Mot de passe oublié ? Contactez votre encadrant.
          </p>
        </div>
      </section>
    </div>
  );
}
