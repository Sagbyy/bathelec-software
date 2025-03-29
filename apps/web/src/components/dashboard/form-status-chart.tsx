import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
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

export default function FormStatusChart({
  className,
  ...props
}: FormStatusChartProps) {
  const { data, isLoading } = useDerivation();
  const [totalDerivations, setTotalDerivations] = useState(0);

  const chartConfig = {
    completed: {
      label: 'A compléter',
      color: '#2B7FFF',
    },
    inProgress: {
      label: 'En cours',
      color: 'hsl(var(--chart-4))',
    },
    reviewing: {
      label: 'En attente de validation',
      color: '#9466FF',
    },
    revising: {
      label: 'En attente de correction',
      color: '#FFD700',
    },
    incorrect: {
      label: 'Incorrect',
      color: '#FF0000',
    },
  };

  const chartData = [
    { name: 'completed', value: 1 },
    { name: 'En cours', value: 3 },
    { name: 'En attente de validation', value: 2 },
    { name: 'En attente de correction', value: 1 },
    { name: 'Incorrect', value: 1 },
  ];

  useEffect(() => {
    setTotalDerivations(data?.length || 0);
  }, [data]);

  return (
    <Card className={cn('col-span-3', className)} {...props}>
      <CardHeader>
        <CardTitle>Form Status Distribution</CardTitle>
        <CardDescription>
          Visual breakdown of forms by their current status
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
              nameKey="name"
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
