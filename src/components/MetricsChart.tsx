import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TimelineData {
  minute: number;
  start_time: string;
  end_time: string;
  vertical_gaze: Record<string, number>;
  horizontal_gaze: Record<string, number>;
  movement_pct: number;
  stationary_pct: number;
  gesture_activity_pct: number;
  top_postures: Record<string, number>;
}

interface MetricsChartProps {
  timeline: TimelineData[];
}

export const MetricsChart = ({ timeline }: MetricsChartProps) => {
  // Transform timeline data for charts
  const movementData = timeline.map(t => ({
    time: t.start_time,
    movement: t.movement_pct,
    gestures: t.gesture_activity_pct,
  }));

  const gazeData = timeline.map(t => ({
    time: t.start_time,
    level: t.vertical_gaze.level || 0,
    up: t.vertical_gaze.up || 0,
    down: t.vertical_gaze.down || 0,
  }));

  const horizontalGazeData = timeline.map(t => ({
    time: t.start_time,
    center: t.horizontal_gaze.center || 0,
    left: t.horizontal_gaze.left || 0,
    right: t.horizontal_gaze.right || 0,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Movement & Gesture Activity</CardTitle>
          <CardDescription>Track your stage presence over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={movementData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="movement" 
                stackId="1"
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.6}
                name="Movement %" 
              />
              <Area 
                type="monotone" 
                dataKey="gestures" 
                stackId="2"
                stroke="hsl(var(--accent))" 
                fill="hsl(var(--accent))" 
                fillOpacity={0.6}
                name="Gesture Activity %" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eye Contact - Vertical Direction</CardTitle>
          <CardDescription>Analyze your gaze direction patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gazeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="level" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Eye Level %" 
              />
              <Line 
                type="monotone" 
                dataKey="up" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Looking Up %" 
              />
              <Line 
                type="monotone" 
                dataKey="down" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Looking Down %" 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eye Contact - Horizontal Direction</CardTitle>
          <CardDescription>See how you engage different audience sections</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={horizontalGazeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="left" fill="hsl(var(--chart-4))" name="Left %" />
              <Bar dataKey="center" fill="hsl(var(--chart-1))" name="Center %" />
              <Bar dataKey="right" fill="hsl(var(--chart-5))" name="Right %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
