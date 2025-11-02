import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { type AnalysisResult } from "@/lib/api";

interface MetricsSummaryProps {
  analysis: AnalysisResult;
}

export const MetricsSummary = ({ analysis }: MetricsSummaryProps) => {
  if (!analysis.pose_analysis) return null;

  const metrics = [
    {
      category: "Eye Contact",
      score: analysis.pose_analysis.eye_contact.score,
      details: [
        { label: "Eye level gaze", value: `${Math.round(analysis.pose_analysis.eye_contact.level_pct)}%`, target: "Target: 60-80%" },
        { label: "Center focus", value: `${Math.round(analysis.pose_analysis.eye_contact.center_pct)}%`, target: "Target: 40-60%" },
        { label: "Audience coverage", value: `${Math.round(analysis.pose_analysis.eye_contact.left_pct + analysis.pose_analysis.eye_contact.right_pct)}%`, target: "Target: 30-50%" },
      ]
    },
    {
      category: "Hand Gestures",
      score: analysis.pose_analysis.gestures.score,
      details: [
        { label: "Open hands", value: `${Math.round(analysis.pose_analysis.gestures.open_hands_pct)}%`, target: "Target: 60-80%" },
        { label: "Hands above waist", value: `${Math.round(analysis.pose_analysis.gestures.hand_above_waist_pct)}%`, target: "Target: 70-90%" },
        { label: "Gestures per minute", value: analysis.pose_analysis.gestures.gestures_per_minute.toFixed(1), target: "Target: 15-25" },
      ]
    },
    {
      category: "Stage Movement",
      score: analysis.pose_analysis.movement.score,
      details: [
        { label: "Moving vs. stationary", value: `${Math.round(analysis.pose_analysis.movement.movement_pct)}% / ${Math.round(analysis.pose_analysis.movement.stationary_pct)}%`, target: "Target: 30-50% / 50-70%" },
        { label: "Stage coverage", value: `${Math.round(analysis.pose_analysis.movement.stage_coverage_pct)}%`, target: "Target: 60-80%" },
        { label: "Position transitions", value: `${analysis.pose_analysis.movement.transitions_count}`, target: "Target: 10-20" },
      ]
    },
    {
      category: "Posture",
      score: analysis.pose_analysis.posture.score,
      details: [
        { label: "Variety score", value: `${analysis.pose_analysis.posture.posture_variety_score}/100`, target: "Target: 70-90" },
        { label: "Dominant posture", value: analysis.pose_analysis.posture.dominant_posture.replace(/L:|R:/g, '').replace(/\+/g, ' + '), target: "" },
      ]
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-primary";
    return "text-warning";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "outline" => {
    if (score >= 85) return "default";
    if (score >= 70) return "secondary";
    return "outline";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Metrics Summary</CardTitle>
        <CardDescription>Comprehensive breakdown of all analyzed metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{metric.category}</h3>
                <div className="flex items-center gap-3">
                  <Badge variant={getScoreBadgeVariant(metric.score)}>
                    {metric.score >= 85 ? "Excellent" : metric.score >= 70 ? "Good" : "Needs Work"}
                  </Badge>
                  <span className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                    {metric.score}
                  </span>
                </div>
              </div>
              <Progress value={metric.score} className="h-2" />
              
              <div className="grid gap-3 mt-4">
                {metric.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 px-4 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium text-sm">{detail.label}</div>
                      {detail.target && <div className="text-xs text-muted-foreground mt-1">{detail.target}</div>}
                    </div>
                    <div className="font-semibold text-lg">{detail.value}</div>
                  </div>
                ))}
              </div>
              
              {index < metrics.length - 1 && <div className="border-b mt-6" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
