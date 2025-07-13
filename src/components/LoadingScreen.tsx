import { Skeleton } from "@/components/ui/skeleton";
import { PawPrint } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <PawPrint className="w-8 h-8 text-primary animate-pulse" />
          <h2 className="text-2xl font-bold">Rukayun</h2>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
        <p className="text-sm text-muted-foreground">
          Conectando con Microsoft...
        </p>
      </div>
    </div>
  );
} 