import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GazeHeatmapProps {
  heatmap: Record<string, { percentage: number; count: number }>;
}

export const GazeHeatmap = ({ heatmap }: GazeHeatmapProps) => {
  const zones = [
    ['left_up', 'center_up', 'right_up'],
    ['left_level', 'center_level', 'right_level'],
    ['left_down', 'center_down', 'right_down']
  ];

  const getZoneLabel = (zone: string) => {
    return zone.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getHeatColor = (percentage: number) => {
    if (percentage > 20) return 'hsl(var(--chart-1))';
    if (percentage > 10) return 'hsl(var(--chart-2))';
    if (percentage > 5) return 'hsl(var(--chart-3))';
    return 'hsl(var(--muted))';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gaze Heatmap - 9 Zone Analysis</CardTitle>
        <CardDescription>Where you looked during your speech</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {zones.flat().map(zone => {
            const data = heatmap[zone] || { percentage: 0, count: 0 };
            return (
              <div
                key={zone}
                className="relative aspect-square rounded-lg border border-border p-4 flex flex-col items-center justify-center transition-all hover:scale-105"
                style={{
                  backgroundColor: getHeatColor(data.percentage),
                  opacity: 0.3 + (data.percentage / 100) * 0.7
                }}
              >
                <div className="text-xs font-medium text-foreground mb-1">
                  {getZoneLabel(zone)}
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {data.percentage.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {data.count} frames
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>💡 Tip: Aim for balanced coverage across all zones</span>
          <div className="flex gap-2 items-center">
            <span>Low</span>
            <div className="h-3 w-20 bg-gradient-to-r from-muted to-chart-1 rounded" />
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
