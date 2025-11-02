import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface HorizontalGazeChartProps {
  distribution: Record<string, number>;
}

export const HorizontalGazeChart = ({ distribution }: HorizontalGazeChartProps) => {
  const data = Object.entries(distribution).map(([zone, percentage]) => ({
    zone: zone.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    percentage: percentage,
    rawZone: zone
  }));

  const getBarColor = (zone: string) => {
    const colors: Record<string, string> = {
      left: 'hsl(var(--chart-4))',
      'center-left': 'hsl(var(--chart-2))',
      center: 'hsl(var(--chart-1))',
      'center-right': 'hsl(var(--chart-2))',
      right: 'hsl(var(--chart-5))',
      away: 'hsl(var(--muted))'
    };
    return colors[zone] || 'hsl(var(--chart-3))';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horizontal Gaze Distribution</CardTitle>
        <CardDescription>Audience engagement across different sections</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="zone" 
              className="text-xs"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              className="text-xs"
              label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Time']}
            />
            <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.rawZone)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-muted-foreground">
          💡 Tip: Engage all sections - aim for balanced distribution across left, center, and right
        </div>
      </CardContent>
    </Card>
  );
};
