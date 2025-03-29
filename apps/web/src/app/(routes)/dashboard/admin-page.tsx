import { DashboardShell } from '@/components/dashboard/shell';
import { FormStatusCards } from '@/components/dashboard/form-status-cards';
import { FormsList } from '@/components/dashboard/forms-list';
import FormStatusChart from '@/components/dashboard/form-status-chart';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardShell>
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <FormStatusCards className="col-span-2 lg:col-span-4" />
            <FormStatusChart className="col-span-2 lg:col-span-3" />
          </div>
          <FormsList />
        </div>
      </DashboardShell>
    </div>
  );
}
