'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { DerivationStatus, Derivation, Technician } from '@repo/types';
import { useDerivation } from '@/features/derivations';
import { useTechnicians } from '@/entities/user';
import { cn } from '@/shared/lib/utils';
import { derivationStatusConfig } from '@/entities/derivation';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DerivationStatusIcon } from '@/entities/derivation';
import { useRouter } from 'next/navigation';
import { formatDate } from 'date-fns';

export function FormsList() {
  const [derivations, setDerivations] = useState<Derivation[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState<Derivation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [technicianFilter, setTechnicianFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<DerivationStatus | ''>('');

  const router = useRouter();

  const { data: derivationsData, isLoading } = useDerivation();
  const { data: techniciansData } = useTechnicians();

  useEffect(() => {
    if (derivationsData) setDerivations(derivationsData);
  }, [derivationsData]);

  useEffect(() => {
    if (techniciansData) setTechnicians(techniciansData);
  }, [techniciansData]);

  const getTechnicianName = (userId: number) => {
    const technician = technicians.find((t) => t.id === userId);
    return technician
      ? technician.firstName + ' ' + technician.lastName
      : 'Unknown';
  };

  const uniqueTechnicians = Array.from(
    new Set(
      derivations.map((derivation) => getTechnicianName(derivation.userId))
    )
  );
  const filteredForms = derivations.filter((derivation) => {
    const chantierAddress = derivation.chantier?.address ?? '';
    const matchesSearch =
      getTechnicianName(derivation.userId)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      chantierAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      derivation.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTechnician =
      technicianFilter === '' ||
      getTechnicianName(derivation.userId) === technicianFilter;
    const matchesStatus =
      statusFilter === '' || derivation.status === statusFilter;

    return matchesSearch && matchesTechnician && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredForms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dérivations</CardTitle>
            <CardDescription>
              Gérer et suivre toutes les dérivations
            </CardDescription>
          </div>
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <Input
              placeholder="Rechercher une dérivation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
            />
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Technicien {technicianFilter && `(${technicianFilter})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrer par technicien</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setTechnicianFilter('')}>
                    Tous les techniciens
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {uniqueTechnicians.map((technician) => (
                    <DropdownMenuItem
                      key={technician}
                      onClick={() => setTechnicianFilter(technician)}
                    >
                      {technician}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Statut{' '}
                    {statusFilter &&
                      `(${derivationStatusConfig[statusFilter].text})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setStatusFilter('')}>
                    Tous les statuts
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="flex flex-col gap-2">
                    {Object.values(DerivationStatus).map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => setStatusFilter(status)}
                      >
                        {derivationStatusConfig[status].text}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-muted-foreground flex items-center justify-center py-10 text-sm">
            Chargement des dérivations...
          </div>
        )}
        {!isLoading && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Technicien</TableHead>
                  <TableHead className="hidden md:table-cell">Chantier</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((derivation) => (
                  <TableRow key={derivation.id}>
                    <TableCell className="font-medium">{derivation.id}</TableCell>
                    <TableCell>
                      {formatDate(derivation.createdAt, 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{getTechnicianName(derivation.userId)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {derivation.chantier?.address ?? '—'}
                    </TableCell>
                    <TableCell>
                      <DerivationStatusIcon derivationStatus={derivation.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {derivation.status === DerivationStatus.REVIEWING ? (
                        <Button
                          variant="default"
                          className={cn('bg-blue-500 hover:bg-blue-600')}
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/admin/derivations/${derivation.id}`
                            )
                          }
                        >
                          <p>À vérifier</p>
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/admin/derivations/${derivation.id}`
                            )
                          }
                        >
                          <p>Voir</p>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Afficher {filteredForms.length === 0 ? 0 : indexOfFirstItem + 1} à{' '}
                {Math.min(indexOfLastItem, filteredForms.length)} sur{' '}
                {filteredForms.length} entrées
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Suivant
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground text-sm">
                  Dérivations par page:
                </span>
                <select
                  className="border-input bg-background h-8 rounded-md border px-2 text-sm"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {[5, 10, 20, 50].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Form Details - {selectedForm?.id}</DialogTitle>
            <DialogDescription>
              Informations détaillées sur cette dérivation
            </DialogDescription>
          </DialogHeader>
          {selectedForm && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Technicien:</span>
                <span className="col-span-3">
                  {getTechnicianName(selectedForm.userId)}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Chantier:</span>
                <span className="col-span-3">{selectedForm.chantier?.address ?? '—'}</span>
              </div>
              {selectedForm.chantier && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">N° Enedis:</span>
                    <span className="col-span-3">{selectedForm.chantier.enedisAffaireNumber}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-sm font-medium">N° Interne:</span>
                    <span className="col-span-3">{selectedForm.chantier.internalAffaireNumber}</span>
                  </div>
                </>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Statut:</span>
                <span className="col-span-3">
                  <div
                    className={cn(
                      derivationStatusConfig[selectedForm.status].textColor,
                      'flex items-center gap-2'
                    )}
                  >
                    <Icon
                      icon={derivationStatusConfig[selectedForm.status].icon}
                    />
                    <span className="font-semibold">
                      {derivationStatusConfig[selectedForm.status].text}
                    </span>
                  </div>
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Date de soumission:</span>
                <span className="col-span-3">{selectedForm.createdAt}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">
                  Dernière mise à jour:
                </span>
                <span className="col-span-3">{selectedForm.createdAt}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
