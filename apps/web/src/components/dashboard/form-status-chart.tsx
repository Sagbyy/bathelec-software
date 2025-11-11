import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Label, Pie, PieChart } from 'recharts';
import { useDerivation } from '@/hooks/queries/use-derivation';
import { useEffect, useState } from 'react';

interface FormStatusChartProps {
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
}

const chartConfig = {
  status: {
    label: 'Status',
  },
  completed: {
    label: 'Terminé',
    color: 'var(--chart-completed)',
  },
  ongoing: {
    label: 'En cours',
    color: 'var(--chart-ongoing)',
  },
  reviewing: {
    label: 'En attente de validation',
    color: 'var(--chart-reviewing)',
  },
  revising: {
    label: 'En attente de correction',
    color: 'var(--chart-revising)',
  },
  incorrect: {
    label: 'Incorrect',
    color: 'var(--chart-incorrect)',
  },
  pending: {
    label: 'À compléter',
    color: 'var(--chart-pending)',
  },
} satisfies ChartConfig;

export default function FormStatusChart({
  className,
  ...props
}: FormStatusChartProps) {
  const { data, isLoading } = useDerivation();
  const [totalDerivations, setTotalDerivations] = useState(0);

  useEffect(() => {
    setTotalDerivations(data?.length || 0);
  }, [data]);

  if (isLoading) {
    return <div>Chargement des dérivations...</div>;
  }

  if (!data) {
    return <div>Aucune dérivation trouvée</div>;
  }

  const derivationsByStatus: Record<string, number> = {};

  for (const derivation of data) {
    const key = derivation.status.toString();
    if (!derivationsByStatus[key]) {
      derivationsByStatus[key] = 0;
    }
    derivationsByStatus[key]++;
  }

  const chartData = Object.entries(derivationsByStatus).map(([key, value]) => ({
    status: key,
    value: value,
    fill: `var(--chart-${key.toLowerCase()})`,
  }));

  return (
    <Card className={cn('col-span-3', className)} {...props}>
      <CardHeader>
        <CardTitle>Statut des dérivations</CardTitle>
        <CardDescription>
          Visualisation du statut des dérivations
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalDerivations.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Dérivations
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
