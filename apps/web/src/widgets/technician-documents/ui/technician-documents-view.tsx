'use client';

import { Fragment } from 'react';
import { Spinner } from '@/shared/ui/spinner';
import { DocumentViewCard } from '@/shared/ui/document-view-card';
import {
  OFFICIAL_DOCUMENT_FIELDS,
  OFFICIAL_DOCUMENT_KEYS,
  useOfficialDocument,
} from '@/entities/official-document';
import {
  VEHICLE_DOCUMENT_FIELDS,
  VEHICLE_DOCUMENT_KEYS,
  useVehicleDocument,
} from '@/entities/vehicle-document';

interface DocumentEntry {
  key: string;
  label: string;
  value: string | null;
  expiresAt: string | null;
}

interface DocumentsSectionProps {
  title: string;
  isLoading: boolean;
  isError: boolean;
  entries: DocumentEntry[];
}

function DocumentsSection({
  title,
  isLoading,
  isError,
  entries,
}: DocumentsSectionProps) {
  return (
    <section aria-label={title}>
      <h2 className="text-muted-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
        {title}
      </h2>
      {isLoading && (
        <div className="flex min-h-[120px] items-center justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading && isError && (
        <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          Impossible de charger ces documents.
        </p>
      )}
      {!isLoading && !isError && (
        <div className="space-y-6 rounded-xl border bg-card p-4 shadow-card sm:p-6">
          {entries.map((entry, index) => (
            <Fragment key={entry.key}>
              {index > 0 && <div className="border-t" />}
              <DocumentViewCard
                label={entry.label}
                value={entry.value}
                expiresAt={entry.expiresAt}
              />
            </Fragment>
          ))}
        </div>
      )}
    </section>
  );
}

interface TechnicianDocumentsViewProps {
  technicianId: number;
}

export function TechnicianDocumentsView({
  technicianId,
}: TechnicianDocumentsViewProps) {
  const official = useOfficialDocument(technicianId);
  const vehicle = useVehicleDocument(technicianId);

  const officialEntries = OFFICIAL_DOCUMENT_KEYS.map((key) => ({
    key,
    label: OFFICIAL_DOCUMENT_FIELDS[key].label,
    value: official.data?.[key] ?? null,
    expiresAt: official.data?.[`${key}ExpiresAt`] ?? null,
  }));

  const vehicleEntries = VEHICLE_DOCUMENT_KEYS.map((key) => ({
    key,
    label: VEHICLE_DOCUMENT_FIELDS[key].label,
    value: vehicle.data?.[key] ?? null,
    expiresAt: vehicle.data?.[`${key}ExpiresAt`] ?? null,
  }));

  return (
    <div className="space-y-8">
      <DocumentsSection
        title="Documents officiels"
        isLoading={official.isLoading}
        isError={official.isError}
        entries={officialEntries}
      />
      <DocumentsSection
        title="Documents véhicule"
        isLoading={vehicle.isLoading}
        isError={vehicle.isError}
        entries={vehicleEntries}
      />
    </div>
  );
}
