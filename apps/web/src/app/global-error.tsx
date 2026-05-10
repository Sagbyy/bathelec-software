'use client';
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="fr">
      <body>
        <div className="flex h-screen flex-col items-center justify-center">
          <h2>Erreur critique</h2>
          <button onClick={reset}>Réessayer</button>
        </div>
      </body>
    </html>
  );
}
