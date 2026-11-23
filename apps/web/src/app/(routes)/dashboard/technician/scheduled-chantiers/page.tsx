'use client';

import { CalendarClock } from 'lucide-react';
import { ScheduledChantiersList } from '@/features/chantiers';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function ScheduledChantiersPage() {
  return (
    <PageContainer width="default">
      <PageHeader
        icon={<CalendarClock />}
        title="Chantiers programmés"
        description="Votre planning de chantiers à venir"
      />
      <ScheduledChantiersList />
    </PageContainer>
  );
}
