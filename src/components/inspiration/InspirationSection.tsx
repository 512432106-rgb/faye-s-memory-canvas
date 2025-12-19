import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CaptureForm } from "./CaptureForm";
import { BubbleView } from "./BubbleView";

type ViewMode = "capture" | "library";

export const InspirationSection = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("capture");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    // Increment key to trigger refetch and switch to map view
    setRefreshKey(prev => prev + 1);
    setViewMode("library");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex items-center justify-center py-4 bg-background border-b border-border">
        <div className="flex gap-1 bg-card p-1 rounded-full border border-border">
          <button
            onClick={() => setViewMode("capture")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
              viewMode === "capture"
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Capture
          </button>
          <button
            onClick={() => setViewMode("library")}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
              viewMode === "library"
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Inspiration Map
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="flex-1 min-h-0 overflow-hidden"
        key={viewMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {viewMode === "capture" ? (
          <CaptureForm onSaved={handleSaved} />
        ) : (
          <BubbleView key={refreshKey} onAddNew={() => setViewMode("capture")} />
        )}
      </motion.div>
    </div>
  );
};
