import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="text-center flex justify-center items-center flex-col">
        <div className="mb-4 mx-auto">
          <Image
            src="/logo-abrisur.webp"
            className="h-auto w-auto"
            width={200}
            height={100}
            alt="loading"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold mb-2">Chargement en cours...</h1>
        <p className="text-gray-600 mb-4">
          Veuillez patienter pendant que nous préparons votre contenu
        </p>
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    </div>
  );
}
