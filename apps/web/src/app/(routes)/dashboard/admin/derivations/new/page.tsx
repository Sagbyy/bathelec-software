import CreateDerivationForm from '@/features/derivations/ui/create-derivation-form';

export default function CreateDerivationPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 bg-white p-6">
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-3xl font-bold">Créer un relevé de dérivation</h1>
        <p className="text-muted-foreground">
          Entrer les informations du relevé de dérivation
        </p>
      </div>
      <CreateDerivationForm />
    </div>
  );
}
