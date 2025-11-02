import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Video, Clock, CheckCircle2, Loader2, AlertCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, type AnalysisListItem, type AnalysisStatus } from "@/lib/api";

const AnalysisList = () => {
  const [analyses, setAnalyses] = useState<AnalysisListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "processing">("all");

  useEffect(() => {
    loadAnalyses();
    const interval = setInterval(loadAnalyses, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [filter]);

  const loadAnalyses = async () => {
    try {
      let statusFilter: AnalysisStatus | undefined;
      if (filter === "completed") {
        statusFilter = "completed";
      } else if (filter === "processing") {
        // Mock API will filter to non-completed statuses
        statusFilter = "detecting_pose";
      }
      
      const data = await api.listAnalyses(1, 20, statusFilter);
      
      // Additional client-side filtering for processing tab
      let filtered = data.analyses;
      if (filter === "processing") {
        filtered = data.analyses.filter(a => 
          a.status !== "completed" && a.status !== "failed"
        );
      }
      
      setAnalyses(filtered);
    } catch (error) {
      console.error("Failed to load analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: AnalysisStatus) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      completed: { variant: "default", icon: <CheckCircle2 className="h-3 w-3" /> },
      failed: { variant: "destructive", icon: <AlertCircle className="h-3 w-3" /> },
      queued: { variant: "secondary", icon: <Clock className="h-3 w-3" /> },
      preprocessing_video: { variant: "secondary", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
      detecting_pose: { variant: "secondary", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
      extracting_features: { variant: "secondary", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
      analyzing_pose: { variant: "secondary", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
      generating_overlay: { variant: "secondary", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
      generating_report: { variant: "secondary", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
    };

    const config = variants[status] || variants.queued;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {status === "completed" ? "Complete" : status === "failed" ? "Failed" : "Processing"}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-primary";
    return "text-warning";
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Your Speeches
        </h1>
        <p className="text-muted-foreground">
          View and manage your speech analysis history
        </p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "completed" | "processing")} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
        </TabsList>
      </Tabs>

      {analyses.length === 0 ? (
        <Card className="p-12 text-center">
          <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No speeches yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload your first video to get started
          </p>
          <Button asChild>
            <Link to="/upload">Upload Video</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="hover:shadow-md transition-smooth overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-lg bg-gradient-primary/10 p-2 shrink-0">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {analysis.title || analysis.video_filename}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDuration(analysis.duration_seconds)} • {formatDate(analysis.created_at)}
                        </p>
                      </div>
                    </div>

                    {analysis.status !== "completed" && analysis.status !== "failed" && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Processing...</span>
                          <span className="font-medium">{Math.round(analysis.progress_pct)}%</span>
                        </div>
                        <Progress value={analysis.progress_pct} className="h-2" />
                      </div>
                    )}

                    {analysis.status === "completed" && analysis.overall_score && (
                      <div className="flex items-center gap-4 mt-4">
                        <div>
                          <div className={`text-3xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                            {analysis.overall_score}
                          </div>
                          <div className="text-xs text-muted-foreground">Overall</div>
                        </div>
                        <div className="h-12 w-px bg-border" />
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-1">
                            {analysis.overall_rating}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            Analysis complete with recommendations
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(analysis.status)}
                    <Button
                      variant={analysis.status === "completed" ? "default" : "outline"}
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <Link to={`/analysis/${analysis.id}`}>
                        {analysis.status === "completed" ? "View Results" : "View Status"}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisList;
