'use client';
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="fr">
      <body className="bg-background font-sans text-foreground">
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
          <h2 className="text-2xl font-semibold">Erreur critique</h2>
          <p className="text-muted-foreground">
            L'application a rencontré un problème inattendu.
          </p>
          <button
            onClick={reset}
            className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
