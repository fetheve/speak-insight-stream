import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, Hand, Move, User, Lightbulb, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, type AnalysisResult } from "@/lib/api";

const AnalysisDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
    const interval = setInterval(loadAnalysis, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [id]);

  const loadAnalysis = async () => {
    if (!id) return;
    
    try {
      const data = await api.getAnalysis(id);
      setAnalysis(data);
      
      // Stop polling if completed or failed
      if (data.status === "completed" || data.status === "failed") {
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to load analysis:", error);
      setLoading(false);
    }
  };

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isProcessing = analysis.status !== "completed" && analysis.status !== "failed";

  const ScoreCard = ({ title, score, icon: Icon, color }: { title: string; score: number; icon: any; color: string }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`rounded-lg bg-${color}/10 p-3`}>
            <Icon className={`h-6 w-6 text-${color}`} />
          </div>
          <div className={`text-3xl font-bold text-${color}`}>
            {score}
          </div>
        </div>
        <h3 className="font-medium">{title}</h3>
        <Progress value={score} className="h-2 mt-2" />
      </CardContent>
    </Card>
  );

  const getScoreColor = (score: number) => {
    if (score >= 85) return "success";
    if (score >= 70) return "primary";
    return "warning";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "destructive";
    if (priority === "medium") return "warning";
    return "secondary";
  };

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Analyses
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {analysis.video.title || analysis.video.filename}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{Math.floor(analysis.video.duration_seconds / 60)} minutes</span>
          <span>•</span>
          <span>Uploaded {new Date(analysis.created_at).toLocaleDateString()}</span>
          {analysis.completed_at && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Completed {new Date(analysis.completed_at).toLocaleDateString()}
              </span>
            </>
          )}
        </div>
      </div>

      {isProcessing && (
        <Card className="mb-8 border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <h3 className="font-semibold">Processing Your Video</h3>
                  <p className="text-sm text-muted-foreground">
                    This usually takes 2-5 minutes for a 5-minute video
                  </p>
                </div>
              </div>
            </div>
            <Progress value={60} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Analyzing pose features...
            </p>
          </CardContent>
        </Card>
      )}

      {analysis.status === "failed" && (
        <Card className="mb-8 border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <h3 className="font-semibold">Analysis Failed</h3>
                <p className="text-sm text-muted-foreground">
                  There was an error processing your video. Please try again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis.status === "completed" && analysis.pose_analysis && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="md:col-span-2 lg:col-span-4 bg-gradient-primary">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-primary-foreground text-2xl font-bold mb-1">
                      Overall Score
                    </h2>
                    <p className="text-primary-foreground/80">
                      {analysis.overall_rating} performance
                    </p>
                  </div>
                  <div className="text-6xl font-bold text-primary-foreground">
                    {analysis.overall_score}
                  </div>
                </div>
              </CardContent>
            </Card>

            <ScoreCard
              title="Eye Contact"
              score={analysis.pose_analysis.eye_contact.score}
              icon={Eye}
              color={getScoreColor(analysis.pose_analysis.eye_contact.score)}
            />
            <ScoreCard
              title="Hand Gestures"
              score={analysis.pose_analysis.gestures.score}
              icon={Hand}
              color={getScoreColor(analysis.pose_analysis.gestures.score)}
            />
            <ScoreCard
              title="Movement"
              score={analysis.pose_analysis.movement.score}
              icon={Move}
              color={getScoreColor(analysis.pose_analysis.movement.score)}
            />
            <ScoreCard
              title="Posture"
              score={analysis.pose_analysis.posture.score}
              icon={User}
              color={getScoreColor(analysis.pose_analysis.posture.score)}
            />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Detailed Metrics</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Eye Contact Analysis</CardTitle>
                  <CardDescription>Distribution of gaze direction throughout your presentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-success">{Math.round(analysis.pose_analysis.eye_contact.level_pct)}%</div>
                      <div className="text-sm text-muted-foreground mt-1">Eye Level</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold">{Math.round(analysis.pose_analysis.eye_contact.center_pct)}%</div>
                      <div className="text-sm text-muted-foreground mt-1">Center</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold">{Math.round(analysis.pose_analysis.eye_contact.left_pct)}%</div>
                      <div className="text-sm text-muted-foreground mt-1">Left</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold">{Math.round(analysis.pose_analysis.eye_contact.right_pct)}%</div>
                      <div className="text-sm text-muted-foreground mt-1">Right</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hand Gestures</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Open hands</span>
                      <span className="font-medium">{Math.round(analysis.pose_analysis.gestures.open_hands_pct)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Above waist</span>
                      <span className="font-medium">{Math.round(analysis.pose_analysis.gestures.hand_above_waist_pct)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gestures per minute</span>
                      <span className="font-medium">{analysis.pose_analysis.gestures.gestures_per_minute.toFixed(1)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Stage Movement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Moving</span>
                      <span className="font-medium">{Math.round(analysis.pose_analysis.movement.movement_pct)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Stage coverage</span>
                      <span className="font-medium">{Math.round(analysis.pose_analysis.movement.stage_coverage_pct)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Transitions</span>
                      <span className="font-medium">{analysis.pose_analysis.movement.transitions_count}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total frames analyzed</span>
                    <span className="font-medium">{analysis.pose_analysis.total_frames_analyzed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Frames with pose detected</span>
                    <span className="font-medium">{analysis.pose_analysis.frames_with_pose.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Average detection confidence</span>
                    <span className="font-medium">{(analysis.pose_analysis.detection_confidence_avg * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Processing time</span>
                    <span className="font-medium">{Math.floor(analysis.processing_time_seconds! / 60)}m {Math.floor(analysis.processing_time_seconds! % 60)}s</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hand Position Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analysis.pose_analysis.gestures.hand_positions).map(([position, percentage]) => (
                      <div key={position}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{position.replace('_', ' ')}</span>
                          <span className="font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {analysis.recommendations.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Excellent Performance!</h3>
                    <p className="text-muted-foreground">
                      No major areas for improvement identified
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {analysis.recommendations.map((rec) => (
                    <Card key={rec.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="rounded-lg bg-primary/10 p-2 shrink-0 mt-1">
                            <Lightbulb className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={getPriorityColor(rec.priority) as any}>
                                {rec.priority} priority
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {rec.category.replace('_', ' ')}
                              </Badge>
                            </div>
                            <h3 className="font-semibold mb-2">{rec.issue}</h3>
                            <p className="text-muted-foreground">{rec.suggestion}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default AnalysisDetail;
