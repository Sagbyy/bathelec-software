'use client';

import { useDerivationById } from '@/hooks/queries/useDerivation';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MultiStepForm } from '@/components/derivations/multi-step-form';

export default function CompleteDerivationPage() {
  const { derivationId } = useParams();

  const {
    data: derivation,
    isLoading,
    error,
  } = useDerivationById(parseInt(derivationId as string));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="mx-10">
      <h1 className="text-4xl font-bold">
        Here, you can complete the derivation from the Kizeo Form
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Status: {derivation?.status}</CardTitle>
        </CardHeader>
        <CardContent>
          <h2>City: {derivation?.city}</h2>
          <h2>Postal Code: {derivation?.postalCode}</h2>
          <h2>Address: {derivation?.address}</h2>
          <h2>User: {derivation?.userId}</h2>
          <h2>Created At: {derivation?.createdAt}</h2>
        </CardContent>
      </Card>
      <div className="container mx-auto px-4 py-10 md:px-6">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Formulaire d'Intervention
        </h1>
        <MultiStepForm />
      </div>
    </div>
  );
}
