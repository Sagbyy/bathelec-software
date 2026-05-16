import { Trophy } from 'lucide-react';

export default function TopChantiersPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-100">
        <Trophy className="h-10 w-10 text-amber-600" strokeWidth={1.75} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Top Chantiers</h1>
      <p className="text-muted-foreground max-w-sm">
        Cette section affichera le classement de vos meilleurs chantiers.
      </p>
    </div>
  );
}
