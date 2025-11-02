import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface HandActivityChartProps {
  leftHand?: Record<string, number>;
  rightHand?: Record<string, number>;
  bothHandsActivePct?: number;
  neitherHandsActivePct?: number;
}

export const HandActivityChart = ({ 
  leftHand, 
  rightHand,
  bothHandsActivePct,
  neitherHandsActivePct
}: HandActivityChartProps) => {
  const leftData = leftHand ? Object.entries(leftHand).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value
  })) : [];

  const rightData = rightHand ? Object.entries(rightHand).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value
  })) : [];

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  return (
    <div className="space-y-6">
      {(bothHandsActivePct !== undefined || neitherHandsActivePct !== undefined) && (
        <Card>
          <CardHeader>
            <CardTitle>Hand Activity Summary</CardTitle>
            <CardDescription>Overall hand usage patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {bothHandsActivePct !== undefined && (
                <div className="p-4 rounded-lg bg-chart-1/10 border border-chart-1/20">
                  <div className="text-sm text-muted-foreground mb-1">Both Hands Active</div>
                  <div className="text-3xl font-bold text-chart-1">{bothHandsActivePct.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Great engagement!</div>
                </div>
              )}
              {neitherHandsActivePct !== undefined && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="text-sm text-muted-foreground mb-1">Neither Hands Active</div>
                  <div className="text-3xl font-bold">{neitherHandsActivePct.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Try to reduce</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {leftData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Left Hand Gestures</CardTitle>
              <CardDescription>Distribution of left hand positions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leftData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leftData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {rightData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Right Hand Gestures</CardTitle>
              <CardDescription>Distribution of right hand positions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={rightData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {rightData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
