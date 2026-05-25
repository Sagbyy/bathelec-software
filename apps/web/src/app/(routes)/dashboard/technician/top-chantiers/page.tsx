import Image from 'next/image';

export default function TopChantiersPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4 p-8 text-center">
      <Image
        src="/images/top-chantier.png"
        alt=""
        width={80}
        height={80}
        className="object-contain"
      />
      <h1 className="text-2xl font-bold text-gray-900">Top Chantiers</h1>
      <p className="text-muted-foreground max-w-sm">
        Cette section affichera le classement de vos meilleurs chantiers.
      </p>
    </div>
  );
}
