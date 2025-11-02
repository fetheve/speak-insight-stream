import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  overlayUrl?: string | null;
  title: string;
  duration: number;
}

export const VideoPlayer = ({ videoUrl, overlayUrl, title, duration }: VideoPlayerProps) => {
  const [showOverlay, setShowOverlay] = useState(!!overlayUrl);
  
  const currentVideoUrl = showOverlay && overlayUrl ? overlayUrl : videoUrl;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {overlayUrl && (
            <div className="flex gap-2">
              <Badge 
                variant={showOverlay ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setShowOverlay(true)}
              >
                With Analysis
              </Badge>
              <Badge 
                variant={!showOverlay ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setShowOverlay(false)}
              >
                Original
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-black">
          <video
            key={currentVideoUrl}
            controls
            className="w-full h-full"
            controlsList="nodownload"
          >
            <source src={currentVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </CardContent>
    </Card>
  );
};
