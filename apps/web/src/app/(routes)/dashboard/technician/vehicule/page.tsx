import { Car } from 'lucide-react';
import { VehicleDocumentsForm } from '@/features/vehicle-documents';

export default function VehiculePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <Car className="h-6 w-6 text-slate-600" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon véhicule</h1>
          <p className="text-muted-foreground text-sm">
            Carte grise et permis de conduire
          </p>
        </div>
      </div>

      <VehicleDocumentsForm />
    </div>
  );
}
