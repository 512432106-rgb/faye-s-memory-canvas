import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DiaryInput } from "./DiaryInput";
import { CanvasReview } from "./CanvasReview";

type ViewMode = "input" | "canvas";

export const DiarySection = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("input");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEntrySaved = () => {
    setRefreshKey(prev => prev + 1);
    setViewMode("canvas");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex items-center justify-center py-4 bg-background border-b border-border">
        <div className="flex gap-1 bg-card p-1 rounded-full border border-border">
          <button
            onClick={() => setViewMode("input")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
              viewMode === "input"
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Write
          </button>
          <button
            onClick={() => setViewMode("canvas")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
              viewMode === "canvas"
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Canvas Review
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div 
        className="flex-1 overflow-hidden"
        key={`${viewMode}-${refreshKey}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {viewMode === "input" ? (
          <DiaryInput onSave={handleEntrySaved} />
        ) : (
          <CanvasReview onAddNew={() => setViewMode("input")} />
        )}
      </motion.div>
    </div>
  );
};
