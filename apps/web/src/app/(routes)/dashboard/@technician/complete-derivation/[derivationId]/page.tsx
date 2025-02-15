'use client';

import { useDerivationById } from '@/hooks/services/useDerivation';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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
    </div>
  );
}
