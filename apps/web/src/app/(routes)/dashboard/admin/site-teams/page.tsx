'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';
import { AlertTriangle, UsersRound } from 'lucide-react';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { Skeleton } from '@/shared/ui/skeleton';
import { Role } from '@repo/types';
import { Separator } from '@/shared/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';
import {
  useSiteTeamsWithUsers,
  useCreateSiteTeam,
  useUpdateSiteTeam,
  useDeleteSiteTeam,
  useAddUserToTeam,
  useRemoveUserFromTeam,
} from '@/features/site-teams/model/use-site-teams';
import { useUsers } from '@/features/users/model/use-user';
import { toast } from 'sonner';
import {
  CreateSiteTeamDto,
  UpdateSiteTeamDto,
  SiteTeamWithUsers,
} from '@/features/site-teams/model/site-teams-service';
import { getApiErrorMessage } from '@/shared/lib/api-error';

export default function SiteTeamsPage() {
  const { data: teams, isLoading, error } = useSiteTeamsWithUsers();
  const { data: users } = useUsers();
  const createTeam = useCreateSiteTeam();
  const updateTeam = useUpdateSiteTeam();
  const deleteTeam = useDeleteSiteTeam();
  const addUserToTeam = useAddUserToTeam();
  const removeUserFromTeam = useRemoveUserFromTeam();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [manageTeamDialogOpen, setManageTeamDialogOpen] = useState(false);
  const [deleteTeamDialogOpen, setDeleteTeamDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateSiteTeamDto>({
    name: '',
    description: '',
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const technicians =
    users?.filter((user) => user.role === Role.TECHNICIAN) || [];

  const handleCreateTeam = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    createTeam.mutate(formData, {
      onSuccess: () => {
        toast.success('Équipe créée avec succès');
        setCreateDialogOpen(false);
        setFormData({ name: '', description: '' });
      },
      onError: (error: Error) => {
        toast.error(
          getApiErrorMessage(error) || "Erreur lors de la création de l'équipe"
        );
      },
    });
  };

  const handleUpdateTeam = () => {
    if (!selectedTeam) return;

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    updateTeam.mutate(
      { teamId: selectedTeam, updateDto: formData },
      {
        onSuccess: () => {
          toast.success('Équipe modifiée avec succès');
        },
        onError: (error: Error) => {
          toast.error(
            getApiErrorMessage(error) ||
              "Erreur lors de la modification de l'équipe"
          );
        },
      }
    );
  };

  const handleDeleteTeam = (team: SiteTeamWithUsers) => {
    setTeamToDelete({ id: team.id, name: team.name });
    setDeleteTeamDialogOpen(true);
  };

  const confirmDeleteTeam = () => {
    if (!teamToDelete) return;

    deleteTeam.mutate(teamToDelete.id, {
      onSuccess: () => {
        toast.success('Équipe supprimée avec succès');
        setDeleteTeamDialogOpen(false);
        setTeamToDelete(null);
      },
      onError: (error: Error) => {
        toast.error(
          getApiErrorMessage(error) ||
            "Erreur lors de la suppression de l'équipe"
        );
      },
    });
  };

  const handleManageTeam = (team: SiteTeamWithUsers) => {
    setSelectedTeam(team.id);
    setFormData({
      name: team.name,
      description: team.description || '',
    });
    setManageTeamDialogOpen(true);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleCloseManageDialog = () => {
    setManageTeamDialogOpen(false);
    setSelectedTeam(null);
    setFormData({ name: '', description: '' });
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleAddUser = (userId: number) => {
    if (!selectedTeam) return;

    addUserToTeam.mutate(
      { teamId: selectedTeam, userId },
      {
        onSuccess: () => {
          toast.success("Technicien ajouté à l'équipe");
          setSearchOpen(false);
          setSearchQuery('');
        },
        onError: (error: Error) => {
          toast.error(
            getApiErrorMessage(error) || "Erreur lors de l'ajout du technicien"
          );
        },
      }
    );
  };

  const handleRemoveUser = (userId: number) => {
    if (!selectedTeam) return;

    removeUserFromTeam.mutate(
      { teamId: selectedTeam, userId },
      {
        onSuccess: () => {
          toast.success("Technicien retiré de l'équipe");
        },
        onError: (error: Error) => {
          toast.error(
            getApiErrorMessage(error) || 'Erreur lors du retrait du technicien'
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="mb-8 h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-56 rounded-xl" />
          ))}
        </div>
        <span className="sr-only">Chargement...</span>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          icon={<AlertTriangle />}
          title="Impossible de charger les équipes"
          description={
            error instanceof Error ? error.message : 'Une erreur est survenue'
          }
        />
      </PageContainer>
    );
  }

  const selectedTeamData = teams?.find((g) => g.id === selectedTeam);
  const selectedTeamUserIds =
    selectedTeamData?.teamMemberships.map((m) => m.user.id) || [];
  const availableTechnicians = technicians.filter(
    (t) => !selectedTeamUserIds.includes(t.id)
  );

  const filteredAvailableTechnicians = availableTechnicians.filter(
    (technician) => {
      const fullName =
        `${technician.firstName} ${technician.lastName}`.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      return (
        fullName.includes(searchLower) ||
        technician.username.toLowerCase().includes(searchLower) ||
        technician.email.toLowerCase().includes(searchLower)
      );
    }
  );

  return (
    <PageContainer className="flex flex-col gap-4">
      <PageHeader
        className="mb-2 md:mb-4"
        icon={<UsersRound />}
        title="Équipes chantier"
        description="Composez les équipes et affectez-leur des techniciens"
        actions={
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Icon icon="hugeicons:add-circle-01" />
                Créer une équipe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une nouvelle équipe</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer une nouvelle équipe
                  chantier.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nom de l&apos;équipe *
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Équipe Nord"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Description de l'équipe"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCreateDialogOpen(false);
                    setFormData({ name: '', description: '' });
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateTeam}
                  disabled={createTeam.isPending}
                >
                  {createTeam.isPending ? 'Création...' : 'Créer'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {teams && teams.length === 0 ? (
        <EmptyState
          icon={<UsersRound />}
          title="Aucune équipe créée pour le moment"
          description="Créez une équipe pour y affecter des techniciens."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams?.map((team) => (
            <Card key={team.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {team.description || 'Aucune description'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTeam(team)}
                      title="Supprimer l'équipe"
                      aria-label="Supprimer l'équipe"
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Icon icon="hugeicons:delete-01" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">
                      Techniciens ({team.teamMemberships.length})
                    </p>
                    {team.teamMemberships.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        Aucun technicien dans cette équipe
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {team.teamMemberships.map((membership) => (
                          <Badge key={membership.user.id} variant="neutral">
                            {membership.user.firstName}{' '}
                            {membership.user.lastName}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleManageTeam(team)}
                    className="w-full"
                  >
                    <Icon icon="hugeicons:settings-01" />
                    Gérer l&apos;équipe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={manageTeamDialogOpen}
        onOpenChange={(open) => {
          setManageTeamDialogOpen(open);
          if (!open) {
            handleCloseManageDialog();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Gérer l&apos;équipe - {selectedTeamData?.name}
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de l&apos;équipe et gérez les
              techniciens.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">
                Informations de l&apos;équipe
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="team-name" className="text-sm font-medium">
                    Nom de l&apos;équipe *
                  </label>
                  <Input
                    id="team-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Équipe Nord"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="team-description"
                    className="text-sm font-medium"
                  >
                    Description *
                  </label>
                  <Textarea
                    id="team-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Description de l'équipe"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleUpdateTeam}
                  disabled={updateTeam.isPending}
                  className="w-full sm:w-auto"
                >
                  {updateTeam.isPending
                    ? 'Modification...'
                    : 'Enregistrer les modifications'}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Gestion des techniciens</h3>

              <div>
                <p className="mb-3 text-sm font-medium">
                  Techniciens dans l&apos;équipe ({selectedTeamUserIds.length})
                </p>
                {selectedTeamUserIds.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Aucun technicien dans cette équipe
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedTeamData?.teamMemberships.map((membership) => (
                      <div
                        key={membership.user.id}
                        className="bg-card flex items-center justify-between rounded-lg border p-2 pl-3"
                      >
                        <span className="text-sm">
                          {membership.user.firstName} {membership.user.lastName}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(membership.user.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 size-9 p-0"
                          title="Retirer de l'équipe"
                          aria-label={`Retirer ${membership.user.firstName} ${membership.user.lastName} de l'équipe`}
                        >
                          <Icon
                            icon="hugeicons:delete-01"
                            className="h-4 w-4"
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">
                  Ajouter un technicien ({availableTechnicians.length}{' '}
                  disponible
                  {availableTechnicians.length > 1 ? 's' : ''})
                </p>
                {availableTechnicians.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Tous les techniciens sont déjà dans cette équipe
                  </p>
                ) : (
                  <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Icon icon="hugeicons:search-01" />
                        Sélectionner un technicien...
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[min(400px,calc(100vw-2rem))] p-0"
                      align="start"
                    >
                      <Command>
                        <CommandInput
                          placeholder="Rechercher un technicien..."
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>
                            Aucun technicien trouvé avec "{searchQuery}"
                          </CommandEmpty>
                          <CommandGroup>
                            {filteredAvailableTechnicians.map((technician) => (
                              <CommandItem
                                key={technician.id}
                                value={`${technician.firstName} ${technician.lastName} ${technician.username} ${technician.email}`}
                                onSelect={() => handleAddUser(technician.id)}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {technician.firstName} {technician.lastName}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    {technician.username} • {technician.email}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseManageDialog}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteTeamDialogOpen}
        onOpenChange={(open) => {
          setDeleteTeamDialogOpen(open);
          if (!open) {
            setTeamToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;équipe</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;équipe{' '}
              <span className="font-semibold">"{teamToDelete?.name}" ?</span>
              <br />
              <br />
              Cette action est irréversible. Tous les techniciens seront retirés
              de l&apos;équipe, mais les techniciens eux-mêmes ne seront pas
              supprimés.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteTeamDialogOpen(false);
                setTeamToDelete(null);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteTeam}
              disabled={deleteTeam.isPending}
            >
              {deleteTeam.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-muted-foreground text-sm">
        <span className="text-foreground font-semibold">
          {teams?.length || 0}
        </span>{' '}
        équipe(s) trouvé(s)
      </p>
    </PageContainer>
  );
}
