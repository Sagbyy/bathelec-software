import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="relative">
          <h1 className="animate-pulse text-9xl font-extrabold text-gray-200">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertCircle className="h-24 w-24 text-red-500" />
          </div>
        </div>
        <h2 className="text-3xl font-semibold text-gray-800">
          Page non trouvée
        </h2>
        <p className="text-gray-600">
          Oops ! La page que vous cherchez n'existe pas. Veuillez vérifier l'URL
          ou revenir à la page d'accueil.
        </p>
        <div className="pt-4">
          <Button asChild className="mr-2" variant="outline">
            <Link href="/dashboard">Retour à l'accueil</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/auth">Se connecter</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
