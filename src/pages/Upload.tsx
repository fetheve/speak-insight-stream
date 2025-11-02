import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file (mp4, mov, avi, mkv)",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const response = await api.uploadVideo(file, { title: title || undefined });
      
      toast({
        title: "Upload successful!",
        description: "Your video is being processed. You'll be redirected to view progress.",
      });
      
      setTimeout(() => {
        navigate(`/analysis/${response.analysis_id}`);
      }, 1500);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Upload Video
        </h1>
        <p className="text-muted-foreground">
          Upload your presentation video to receive detailed speech and body language analysis
        </p>
      </div>

      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle>Video Upload</CardTitle>
          <CardDescription>
            Supported formats: MP4, MOV, AVI, MKV • Max size: 2GB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`
              relative rounded-lg border-2 border-dashed p-12 text-center transition-smooth
              ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${file ? 'border-success bg-success/5' : ''}
            `}
          >
            <input
              type="file"
              id="video-upload"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {!file ? (
              <label htmlFor="video-upload" className="cursor-pointer">
                <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">
                  Drop your video here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  We'll analyze your speech patterns, gestures, and stage presence
                </p>
              </label>
            ) : (
              <div className="space-y-4">
                <Video className="mx-auto h-12 w-12 text-success" />
                <div>
                  <p className="font-medium text-lg mb-1">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  Change file
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Presentation Title <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., My Icebreaker Speech"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            size="lg"
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-4 w-4" />
                Start Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-gradient-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">What happens next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Video Processing</p>
              <p className="text-muted-foreground">We'll analyze your video frame by frame</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              2
            </div>
            <div>
              <p className="font-medium">Body Language Analysis</p>
              <p className="text-muted-foreground">Track eye contact, gestures, and movement</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              3
            </div>
            <div>
              <p className="font-medium">Get Your Report</p>
              <p className="text-muted-foreground">Receive detailed feedback and recommendations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
