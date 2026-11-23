import { FormStatusCards } from '@/widgets/dashboard/ui/form-status-cards';
import { FormsList } from '@/widgets/dashboard/ui/forms-list';
import FormStatusChart from '@/widgets/dashboard/ui/form-status-chart';
import { ReviewStatsCards } from '@/widgets/dashboard/ui/review-stats-cards';
import { AffaireStatsTable } from '@/widgets/dashboard/ui/affaire-stats-table';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';

export default function AdminPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Vue d'ensemble"
        title="Tableau de bord"
        description="Suivez l'avancement des dérivations et la qualité des relevés terrain."
      />
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="grid gap-4 lg:grid-cols-7">
          <FormStatusCards className="lg:col-span-4" />
          <FormStatusChart className="lg:col-span-3" />
        </div>
        <ReviewStatsCards />
        <AffaireStatsTable />
        <FormsList />
      </div>
    </PageContainer>
  );
}
