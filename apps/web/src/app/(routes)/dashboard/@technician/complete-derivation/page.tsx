'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { CompleteToDerivation } from '@repo/types/index';
import axios from 'axios';
import Cookies from 'js-cookie';
import getUsernameByToken from '@/lib/decodeJwt';
import { useEffect } from 'react';

const fetchCompleteToDerivation = async (): Promise<CompleteToDerivation[]> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/informations`,
    {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }
  );

  return response.data;
};

export default function CompleteDerivationPage() {
  // const {
  //   data: completeToDerivations = [],
  //   isLoading,
  //   error,
  // } = useQuery<CompleteToDerivation[]>({
  //   queryFn: fetchCompleteToDerivation,
  //   queryKey: [
  //     'completeToDerivations',
  //     getUsernameByToken(Cookies.get('token') || ''),
  //   ],
  // });

  const completeToDerivations = [
    {
      id: 1,
      address: '1 rue de la paix',
      city: 'Paris',
      postalCode: '75000',
      createdAt: '2022-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      address: '2 rue de la paix',
      city: 'Paris',
      postalCode: '75000',
      createdAt: '2022-01-01T00:00:00.000Z',
    },
    {
      id: 3,
      address: '3 rue de la paix',
      city: 'Paris',
      postalCode: '75000',
      createdAt: '2022-01-01T00:00:00.000Z',
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">
        Liste des relevés de dérivation
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Adresse</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Code postal</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>Chargement...</TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={4}>Une erreur est survenue</TableCell>
            </TableRow>
          ) : */}{' '}
          {completeToDerivations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>Aucun relevé de dérivation</TableCell>
            </TableRow>
          ) : (
            completeToDerivations.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.city}</TableCell>
                <TableCell>{item.postalCode}</TableCell>
                <TableCell>
                  <Link href={`/todo/${item.id}`}>
                    <Button variant="outline">Modifier</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
