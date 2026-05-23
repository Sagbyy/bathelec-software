'use client';

import { Switch } from '@/shared/ui/switch';
import { Label } from '@/shared/ui/label';
import {
  useHabilitation,
  useUpdateHabilitation,
  HabilitationKey,
  DEFAULT_HABILITATIONS,
} from '@/entities/habilitation';

interface HabilitationsAdminProps {
  technicianId: number;
}

const GROUPS: {
  title: string;
  items: { key: HabilitationKey; label: string; description: string }[];
}[] = [
  {
    title: 'Opération non électrique — Basse tension',
    items: [
      {
        key: 'b0',
        label: 'B0',
        description: 'Maçonnerie, plomberie, serrurerie, peinture',
      },
      {
        key: 'bs',
        label: 'BS',
        description:
          'Intervention sur climatisation, concierge, installateur alarme',
      },
      {
        key: 'be',
        label: 'BE',
        description: 'Intervention élémentaire (climatisation, alarme)',
      },
    ],
  },
  {
    title: 'Opération non électrique — Haute tension',
    items: [
      {
        key: 'h0',
        label: 'H0',
        description: 'Maçonnerie, plomberie, serrurerie, peinture',
      },
      { key: 'h0v', label: 'H0V', description: 'Travaux au voisinage HT' },
    ],
  },
  {
    title: 'Exécutant',
    items: [
      { key: 'b1', label: 'B1', description: 'Exécutant électricien BT' },
      {
        key: 'b1v',
        label: 'B1V',
        description: 'Exécutant électricien BT au voisinage',
      },
      { key: 'h1', label: 'H1', description: 'Exécutant électricien HT' },
      {
        key: 'h1v',
        label: 'H1V',
        description: 'Exécutant électricien HT au voisinage',
      },
    ],
  },
  {
    title: 'Chargé de travaux',
    items: [
      { key: 'b2', label: 'B2', description: 'Chargé de travaux BT' },
      {
        key: 'b2v',
        label: 'B2V',
        description: 'Chargé de travaux BT au voisinage',
      },
      {
        key: 'b2vEssais',
        label: 'B2V essais',
        description: 'Chargé de travaux BT — essais',
      },
      { key: 'h2', label: 'H2', description: 'Chargé de travaux HT' },
      {
        key: 'h2v',
        label: 'H2V',
        description: 'Chargé de travaux HT au voisinage',
      },
      {
        key: 'h2vEssais',
        label: 'H2V essais',
        description: 'Chargé de travaux HT — essais',
      },
    ],
  },
  {
    title: 'Chargé de consignation',
    items: [
      { key: 'bc', label: 'BC', description: 'Chargé de consignation BT' },
      { key: 'hc', label: 'HC', description: 'Chargé de consignation HT' },
    ],
  },
  {
    title: "Chargé d'intervention",
    items: [
      {
        key: 'br',
        label: 'BR',
        description: "Chargé d'intervention générale BT",
      },
    ],
  },
  {
    title: "Chargé d'opérations",
    items: [
      {
        key: 'beAttribut',
        label: 'BE + attribut',
        description:
          "Chargé d'opérations BT (essais, mesurages, vérifications)",
      },
      {
        key: 'heAttribut',
        label: 'HE + attribut',
        description:
          "Chargé d'opérations HT (essais, mesurages, vérifications)",
      },
    ],
  },
];

export function HabilitationsAdmin({ technicianId }: HabilitationsAdminProps) {
  const { data, isLoading } = useHabilitation(technicianId);
  const { mutate, isPending } = useUpdateHabilitation(technicianId);

  const habilitations = data ?? {
    userId: technicianId,
    ...DEFAULT_HABILITATIONS,
  };

  const handleToggle = (key: HabilitationKey, value: boolean) => {
    mutate({ [key]: value });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-gray-400">
        Chargement…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {GROUPS.map((group) => (
        <div
          key={group.title}
          className="rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="rounded-t-xl border-b bg-gray-50 px-4 py-3">
            <p className="text-sm font-semibold text-gray-700">{group.title}</p>
          </div>
          <div className="divide-y">
            {group.items.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <Label
                    htmlFor={`toggle-${item.key}`}
                    className="text-sm font-medium text-gray-900"
                  >
                    {item.label}
                  </Label>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <Switch
                  id={`toggle-${item.key}`}
                  checked={habilitations[item.key]}
                  onCheckedChange={(checked) => handleToggle(item.key, checked)}
                  disabled={isPending}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
