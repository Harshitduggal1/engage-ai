import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface OverallScoreChartProps {
  overallScore: number;
}

export default function OverallScoreChart({
  overallScore,
}: OverallScoreChartProps) {
  const pieChartData = [
    {
      name: "Risks",
      value: 100 - overallScore,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Opportunities",
      value: overallScore,
      fill: "hsl(var(--chart-2))",
    },
  ];

  const chartConfig = {
    value: {
      label: "value",
    },
    Risks: {
      label: "Risks",
      color: "hsl(var(--chart-1))",
    },
    Opportunitiesites: {
      label: "Opportunities",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Overall Score</CardTitle>
        <CardDescription>Contract analysis results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip cursor content={<ChartTooltipContent />} />
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                paddingAngle={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          <tspan
                            x={viewBox.cx}
                            dy="-0.5em"
                            fontSize="24"
                            fontWeight="bold"
                          >
                            {overallScore}%
                          </tspan>
                          <tspan x={viewBox.cx} dy="1.2em" fontSize="14">
                            Score
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "hsl(var(--chart-1))" }}></div>
            <span>Risks</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: "hsl(var(--chart-2))" }}></div>
            <span>Opportunities</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}