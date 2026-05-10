'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  useUsersGroupsWithUsers,
  useCreateUserGroup,
  useUpdateUserGroup,
  useDeleteUserGroup,
  useAddUserToGroup,
  useRemoveUserFromGroup,
} from '@/hooks/queries/use-users-groups';
import { useUsers } from '@/hooks/queries/use-user';
import { toast } from 'sonner';
import {
  CreateUserGroupDto,
  UpdateUserGroupDto,
} from '@/services/users-groups-service';

export default function TechniciansGroupPage() {
  const { data: groups, isLoading, error } = useUsersGroupsWithUsers();
  const { data: users } = useUsers();
  const createGroup = useCreateUserGroup();
  const updateGroup = useUpdateUserGroup();
  const deleteGroup = useDeleteUserGroup();
  const addUserToGroup = useAddUserToGroup();
  const removeUserFromGroup = useRemoveUserFromGroup();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [manageGroupDialogOpen, setManageGroupDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateUserGroupDto>({
    name: '',
    description: '',
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const technicians = users?.filter((user) => user.role === 'technician') || [];

  const handleCreateGroup = () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    createGroup.mutate(formData, {
      onSuccess: () => {
        toast.success('Groupe créé avec succès');
        setCreateDialogOpen(false);
        setFormData({ name: '', description: '' });
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            'Erreur lors de la création du groupe'
        );
      },
    });
  };

  const handleUpdateGroup = () => {
    if (!selectedGroup) return;

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    updateGroup.mutate(
      { groupId: selectedGroup, updateDto: formData },
      {
        onSuccess: () => {
          toast.success('Groupe modifié avec succès');
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              'Erreur lors de la modification du groupe'
          );
        },
      }
    );
  };

  const handleDeleteGroup = (group: any) => {
    setGroupToDelete({ id: group.id, name: group.name });
    setDeleteGroupDialogOpen(true);
  };

  const confirmDeleteGroup = () => {
    if (!groupToDelete) return;

    deleteGroup.mutate(groupToDelete.id, {
      onSuccess: () => {
        toast.success('Groupe supprimé avec succès');
        setDeleteGroupDialogOpen(false);
        setGroupToDelete(null);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            'Erreur lors de la suppression du groupe'
        );
      },
    });
  };

  const handleManageGroup = (group: any) => {
    setSelectedGroup(group.id);
    setFormData({
      name: group.name,
      description: group.description || '',
    });
    setManageGroupDialogOpen(true);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleCloseManageDialog = () => {
    setManageGroupDialogOpen(false);
    setSelectedGroup(null);
    setFormData({ name: '', description: '' });
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleAddUser = (userId: number) => {
    if (!selectedGroup) return;

    addUserToGroup.mutate(
      { groupId: selectedGroup, userId },
      {
        onSuccess: () => {
          toast.success('Technicien ajouté au groupe');
          setSearchOpen(false);
          setSearchQuery('');
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Erreur lors de l'ajout du technicien"
          );
        },
      }
    );
  };

  const handleRemoveUser = (userId: number) => {
    if (!selectedGroup) {
      console.error('No selected group');
      return;
    }

    console.log('Removing user', userId, 'from group', selectedGroup);

    removeUserFromGroup.mutate(
      { groupId: selectedGroup, userId },
      {
        onSuccess: () => {
          toast.success('Technicien retiré du groupe');
        },
        onError: (error: any) => {
          console.error('Error removing user:', error);
          toast.error(
            error?.response?.data?.message ||
              'Erreur lors du retrait du technicien'
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <div className="flex items-center justify-center py-12">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">
            Erreur:{' '}
            {error instanceof Error ? error.message : 'Une erreur est survenue'}
          </p>
        </div>
      </div>
    );
  }

  const selectedGroupData = groups?.find((g) => g.id === selectedGroup);
  const selectedGroupUserIds =
    selectedGroupData?.groupMemberships.map((m) => m.user.id) || [];
  const availableTechnicians = technicians.filter(
    (t) => !selectedGroupUserIds.includes(t.id)
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
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Groupes de techniciens
        </h2>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon icon="hugeicons:add-circle-01" />
              Créer un groupe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau groupe</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau groupe de
                techniciens.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nom du groupe *
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
                  placeholder="Description du groupe"
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
                onClick={handleCreateGroup}
                disabled={createGroup.isPending}
              >
                {createGroup.isPending ? 'Création...' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {groups && groups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icon
              icon="hugeicons:users-group"
              className="text-muted-foreground mb-4 text-4xl"
            />
            <p className="text-muted-foreground">
              Aucun groupe créé pour le moment
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups?.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {group.description || 'Aucune description'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGroup(group)}
                      title="Supprimer le groupe"
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
                      Techniciens ({group.groupMemberships.length})
                    </p>
                    {group.groupMemberships.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        Aucun technicien dans ce groupe
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {group.groupMemberships.map((membership) => (
                          <Badge key={membership.user.id} variant="secondary">
                            {membership.user.firstName}{' '}
                            {membership.user.lastName}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleManageGroup(group)}
                    className="w-full"
                  >
                    <Icon icon="hugeicons:settings-01" />
                    Gérer le groupe
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={manageGroupDialogOpen}
        onOpenChange={(open) => {
          setManageGroupDialogOpen(open);
          if (!open) {
            handleCloseManageDialog();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Gérer le groupe - {selectedGroupData?.name}
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations du groupe et gérez les techniciens.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Informations du groupe</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="group-name" className="text-sm font-medium">
                    Nom du groupe *
                  </label>
                  <Input
                    id="group-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Équipe Nord"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="group-description"
                    className="text-sm font-medium"
                  >
                    Description *
                  </label>
                  <Textarea
                    id="group-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Description du groupe"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleUpdateGroup}
                  disabled={updateGroup.isPending}
                  className="w-full sm:w-auto"
                >
                  {updateGroup.isPending
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
                  Techniciens dans le groupe ({selectedGroupUserIds.length})
                </p>
                {selectedGroupUserIds.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Aucun technicien dans ce groupe
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedGroupData?.groupMemberships.map((membership) => (
                      <div
                        key={membership.user.id}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <span className="text-sm">
                          {membership.user.firstName} {membership.user.lastName}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(membership.user.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          title="Retirer du groupe"
                          aria-label={`Retirer ${membership.user.firstName} ${membership.user.lastName} du groupe`}
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
                    Tous les techniciens sont déjà dans ce groupe
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
                    <PopoverContent className="w-[400px] p-0" align="start">
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
        open={deleteGroupDialogOpen}
        onOpenChange={(open) => {
          setDeleteGroupDialogOpen(open);
          if (!open) {
            setGroupToDelete(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le groupe</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le groupe{' '}
              <span className="font-semibold">"{groupToDelete?.name}" ?</span>
              <br />
              <br />
              Cette action est irréversible. Tous les techniciens seront retirés
              du groupe, mais les techniciens eux-mêmes ne seront pas supprimés.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteGroupDialogOpen(false);
                setGroupToDelete(null);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteGroup}
              disabled={deleteGroup.isPending}
            >
              {deleteGroup.isPending ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-muted-foreground text-sm">
        <span className="font-bold">{groups?.length || 0}</span> groupe(s)
        trouvé(s)
      </p>
    </div>
  );
}
