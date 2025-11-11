import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4">
          <Image
            src="/logo-abrisur.webp"
            className="h-auto w-auto"
            width={200}
            height={100}
            alt="loading"
            priority
          />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Chargement en cours...</h1>
        <p className="mb-4 text-gray-600">
          Veuillez patienter pendant que nous préparons votre contenu
        </p>
        <div className="flex justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      </div>
    </div>
  );
}
