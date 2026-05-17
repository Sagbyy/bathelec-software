import { FileText } from 'lucide-react';
import { OfficialDocumentsForm } from '@/features/official-documents';

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
          <FileText className="h-6 w-6 text-purple-600" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Mes documents officiels
          </h1>
          <p className="text-muted-foreground text-sm">
            Pièce d'identité, carte BTP et mutuelle
          </p>
        </div>
      </div>

      <OfficialDocumentsForm />
    </div>
  );
}
