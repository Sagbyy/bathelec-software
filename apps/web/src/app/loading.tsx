import Image from 'next/image';

export default function loading() {
  return (
    <div className="w-screen h-screen bg-white">
      <div className="top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center justify-center flex-col">
          <Image
            src="/bathelec-brand-logo.png"
            width={100}
            height={100}
            alt="loading"
          />
          <p>Chargement en cours</p>
        </div>
      </div>
    </div>
  );
}
