import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface StageTrajectoryProps {
  analysisId: string;
  positions?: Array<{ x: number; y: number; timestamp: number }>;
  apiBaseUrl?: string;
}

export const StageTrajectory = ({ analysisId, positions, apiBaseUrl = '' }: StageTrajectoryProps) => {
  const [imageError, setImageError] = useState(false);
  const [showFallback, setShowFallback] = useState(!apiBaseUrl);

  // Fallback: render trajectory using Canvas/SVG if image endpoint fails or positions available
  const renderFallbackTrajectory = () => {
    if (!positions || positions.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px] bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">No trajectory data available</p>
        </div>
      );
    }

    const width = 800;
    const height = 600;
    const padding = 40;

    return (
      <svg width="100%" height="400" viewBox={`0 0 ${width} ${height}`} className="border border-border rounded-lg bg-background">
        {/* Stage boundaries */}
        <rect
          x={padding}
          y={padding}
          width={width - 2 * padding}
          height={height - 2 * padding}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Trajectory path */}
        <path
          d={positions.map((pos, i) => {
            const x = padding + pos.x * (width - 2 * padding);
            const y = padding + pos.y * (height - 2 * padding);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeOpacity="0.6"
        />

        {/* Position markers */}
        {positions.map((pos, i) => {
          const x = padding + pos.x * (width - 2 * padding);
          const y = padding + pos.y * (height - 2 * padding);
          const isStart = i === 0;
          const isEnd = i === positions.length - 1;
          
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={isStart || isEnd ? 8 : 4}
                fill={isStart ? 'hsl(var(--chart-2))' : isEnd ? 'hsl(var(--chart-3))' : 'hsl(var(--primary))'}
                opacity={isStart || isEnd ? 1 : 0.5}
              />
              {isStart && <text x={x} y={y - 15} textAnchor="middle" fontSize="12" fill="hsl(var(--foreground))">Start</text>}
              {isEnd && <text x={x} y={y - 15} textAnchor="middle" fontSize="12" fill="hsl(var(--foreground))">End</text>}
            </g>
          );
        })}

        {/* Labels */}
        <text x={padding} y={height - 10} fontSize="12" fill="hsl(var(--muted-foreground))">Stage Left</text>
        <text x={width - padding} y={height - 10} textAnchor="end" fontSize="12" fill="hsl(var(--muted-foreground))">Stage Right</text>
      </svg>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stage Movement Trajectory</CardTitle>
        <CardDescription>Your movement path during the speech</CardDescription>
      </CardHeader>
      <CardContent>
        {showFallback || imageError ? (
          renderFallbackTrajectory()
        ) : (
          <img
            src={`${apiBaseUrl}/api/v1/analyses/${analysisId}/trajectory-image`}
            alt="Stage Trajectory"
            className="w-full rounded-lg border border-border"
            onError={() => {
              setImageError(true);
              setShowFallback(true);
            }}
          />
        )}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">Start Position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-chart-3" />
            <span className="text-muted-foreground">End Position</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          💡 Tip: Move naturally across the stage to engage different audience sections
        </div>
      </CardContent>
    </Card>
  );
};
