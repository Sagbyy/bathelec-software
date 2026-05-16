import { FileText } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-100">
        <FileText className="h-10 w-10 text-purple-600" strokeWidth={1.75} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Mes documents officiels</h1>
      <p className="text-muted-foreground max-w-sm">
        Retrouvez ici tous vos documents officiels et administratifs.
      </p>
    </div>
  );
}
