import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Filter, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickyNote } from "./StickyNote";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type FilterType = "all" | "happy" | "sad";

interface DiaryEntry {
  id: string;
  entry_date: string;
  title: string | null;
  content: string;
  mood: string | null;
  weather: string | null;
}

interface CanvasReviewProps {
  onAddNew?: () => void;
}

export const CanvasReview = ({ onAddNew }: CanvasReviewProps) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>("all");
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("diary_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    if (filter === "all") return true;
    return entry.mood === filter;
  });

  // Generate random positions and rotations for notes
  const getRandomStyle = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      top: 120 + row * 220 + (Math.random() * 40 - 20),
      left: 80 + col * 320 + (Math.random() * 40 - 20),
    };
  };

  const getRandomRotation = () => Math.floor(Math.random() * 7) - 3;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-background/80 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Memory Canvas</h1>
            <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
              <span>✨</span>
              Drag notes to rearrange · Click to reflect on your past self
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 p-1.5 rounded-xl bg-card border border-border shadow-card">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "flex h-8 items-center gap-2 rounded-lg px-3 transition-colors",
                filter === "all" 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Filter className="size-4" />
              <span className="text-xs font-bold uppercase tracking-wide">All</span>
            </button>
            <button
              onClick={() => setFilter("happy")}
              className={cn(
                "flex h-8 items-center gap-2 rounded-lg px-3 transition-colors",
                filter === "happy"
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-medium">Happy</span>
            </button>
            <button
              onClick={() => setFilter("sad")}
              className={cn(
                "flex h-8 items-center gap-2 rounded-lg px-3 transition-colors",
                filter === "sad"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-xs font-medium">Sad</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 corkboard-pattern overflow-auto relative p-10 min-h-[600px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-4">No diary entries yet</p>
            <Button onClick={onAddNew} className="gap-2">
              <Plus className="size-4" />
              Write your first entry
            </Button>
          </div>
        ) : (
          filteredEntries.map((entry, index) => (
            <StickyNote
              key={entry.id}
              id={entry.id}
              date={formatDate(entry.entry_date)}
              title={entry.title || "Untitled"}
              content={entry.content}
              mood={(entry.mood === "happy" || entry.mood === "loved") ? "happy" : "sad"}
              style={getRandomStyle(index)}
              rotation={getRandomRotation()}
              onUpdate={fetchEntries}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <motion.div 
        className="absolute bottom-6 right-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button size="lg" className="size-14 rounded-full shadow-float p-0" onClick={onAddNew}>
          <Plus className="size-6" />
        </Button>
      </motion.div>
    </div>
  );
};
