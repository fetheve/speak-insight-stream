import { Link, useLocation } from "react-router-dom";
import { Video, Upload, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="rounded-lg bg-gradient-primary p-2">
              <Video className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Speaker Companion
            </span>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analyses</span>
              </Link>
            </Button>
            <Button
              variant={isActive("/upload") ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link to="/upload" className="gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      
      <main className="container px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
