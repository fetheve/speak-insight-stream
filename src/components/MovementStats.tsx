import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, MapPin, Zap } from "lucide-react";

interface MovementStatsProps {
  totalDistance?: number;
  averageSpeed?: number;
  staticPhasesCount?: number;
}

export const MovementStats = ({ 
  totalDistance, 
  averageSpeed, 
  staticPhasesCount 
}: MovementStatsProps) => {
  if (!totalDistance && !averageSpeed && !staticPhasesCount) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement Statistics</CardTitle>
        <CardDescription>Quantitative analysis of your stage movement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {totalDistance !== undefined && (
            <div className="p-4 rounded-lg bg-chart-1/10 border border-chart-1/20">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-chart-1" />
                <div className="text-sm text-muted-foreground">Total Distance</div>
              </div>
              <div className="text-3xl font-bold text-chart-1">{totalDistance.toFixed(1)}m</div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalDistance > 10 ? 'Good coverage!' : 'Try moving more'}
              </div>
            </div>
          )}

          {averageSpeed !== undefined && (
            <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-chart-2" />
                <div className="text-sm text-muted-foreground">Average Speed</div>
              </div>
              <div className="text-3xl font-bold text-chart-2">{averageSpeed.toFixed(2)} m/s</div>
              <div className="text-xs text-muted-foreground mt-1">
                {averageSpeed > 0.3 && averageSpeed < 0.5 ? 'Perfect pace!' : 'Adjust pacing'}
              </div>
            </div>
          )}

          {staticPhasesCount !== undefined && (
            <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-chart-3" />
                <div className="text-sm text-muted-foreground">Static Phases</div>
              </div>
              <div className="text-3xl font-bold text-chart-3">{staticPhasesCount}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {staticPhasesCount <= 5 ? 'Good variety!' : 'Stay more active'}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
