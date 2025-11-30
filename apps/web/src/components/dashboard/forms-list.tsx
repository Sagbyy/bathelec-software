'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DerivationStatus, Derivation, Technician } from '@repo/types';
import { useDerivation } from '@/hooks/queries/use-derivation';
import { useTechnicians } from '@/hooks/queries/use-technician';
import { cn } from '@/lib/utils';
import { derivationStatusConfig } from '@/constants/derivations';
import { Icon } from '@iconify/react/dist/iconify.js';
import DerivationStatusIcon from '../shared/derivation-status-icon';
import { useRouter } from 'next/navigation';

export function FormsList() {
  const [derivations, setDerivations] = useState<Derivation[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForm, setSelectedForm] = useState<Derivation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter states
  const [technicianFilter, setTechnicianFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<DerivationStatus | ''>('');
  const [cityFilter, setCityFilter] = useState('');

  const router = useRouter();

  const { data: derivationsData, isLoading, error } = useDerivation();
  const {
    data: techniciansData,
    isLoading: techniciansLoading,
    error: techniciansError,
  } = useTechnicians();

  useEffect(() => {
    if (derivationsData) {
      setDerivations(derivationsData);
    }
    if (techniciansData) {
      setTechnicians(techniciansData);
    }
  }, [derivationsData, techniciansData]);

  const getTechnicianName = (userId: number) => {
    const technician = technicians.find((t) => t.id === userId);
    return technician
      ? technician.firstName + ' ' + technician.lastName
      : 'Unknown';
  };

  // Get unique technicians and cities for filter dropdowns
  const uniqueTechnicians = Array.from(
    new Set(
      derivations.map((derivation) => getTechnicianName(derivation.userId))
    )
  );
  const uniqueCities = Array.from(
    new Set(derivations.map((derivation) => derivation.city))
  );

  const filteredForms = derivations.filter((derivation) => {
    // Apply search query filter
    const matchesSearch =
      getTechnicianName(derivation.userId)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      derivation.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      derivation.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(derivation.postalCode)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      derivation.status.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply specific filters
    const matchesTechnician =
      technicianFilter === '' ||
      getTechnicianName(derivation.userId) === technicianFilter;
    const matchesStatus =
      statusFilter === '' || derivation.status === statusFilter;
    const matchesCity = cityFilter === '' || derivation.city === cityFilter;

    return matchesSearch && matchesTechnician && matchesStatus && matchesCity;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredForms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredForms.length / itemsPerPage);

  // Handle page changes
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Ville {cityFilter && `(${cityFilter})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrer par ville</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setCityFilter('')}>
                    Toutes les villes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {uniqueCities.map((city) => (
                    <DropdownMenuItem
                      key={city}
                      onClick={() => setCityFilter(city)}
                    >
                      {city}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Technicien</TableHead>
              <TableHead className="hidden md:table-cell">Adresse</TableHead>
              <TableHead className="hidden md:table-cell">Ville</TableHead>
              <TableHead className="hidden md:table-cell">
                Code postal
              </TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((derivation) => (
              <TableRow key={derivation.id}>
                <TableCell className="font-medium">{derivation.id}</TableCell>
                <TableCell>{getTechnicianName(derivation.userId)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {derivation.address}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {derivation.city}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {derivation.postalCode}
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
                      <p>Corriger</p>
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
            Afficher {indexOfFirstItem + 1} à{' '}
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
              disabled={currentPage === totalPages}
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
                <span className="text-sm font-medium">Adresse:</span>
                <span className="col-span-3">{selectedForm.address}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Ville:</span>
                <span className="col-span-3">{selectedForm.city}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Code postal:</span>
                <span className="col-span-3">{selectedForm.postalCode}</span>
              </div>
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
