import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Palette, Dumbbell, Book, Globe, UtensilsCrossed, Flower2, Check, Plus, ZoomIn, ZoomOut, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type FilterType = "all" | "practiced" | "unpracticed";

interface Inspiration {
  id: string;
  title: string | null;
  content: string;
  category: string | null;
  is_practiced: boolean;
  created_at: string;
}

const categoryIcons: Record<string, typeof Sparkles> = {
  fitness: Dumbbell,
  art: Palette,
  food: UtensilsCrossed,
  nature: Flower2,
  reading: Book,
  language: Globe,
  default: Sparkles,
};

const floatClasses = ["animate-float-slow", "animate-float-medium", "animate-float-fast"];

export const BubbleView = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInspirations();
    }
  }, [user]);

  const fetchInspirations = async () => {
    try {
      const { data, error } = await supabase
        .from("inspirations")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInspirations(data || []);
    } catch (error) {
      console.error("Error fetching inspirations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInspirations = inspirations.filter((item) => {
    if (filter === "all") return true;
    if (filter === "practiced") return item.is_practiced;
    return !item.is_practiced;
  });

  // Generate random positions for bubbles
  const getBubblePosition = (index: number, total: number) => {
    const cols = Math.ceil(Math.sqrt(total));
    const row = Math.floor(index / cols);
    const col = index % cols;
    const baseX = 100 + col * 150 + (Math.random() * 60 - 30);
    const baseY = 100 + row * 140 + (Math.random() * 40 - 20);
    return { x: baseX, y: baseY };
  };

  const getBubbleSize = (index: number) => {
    const sizes = [80, 90, 100, 85, 95];
    return sizes[index % sizes.length];
  };

  const getIcon = (category: string | null) => {
    if (!category) return categoryIcons.default;
    return categoryIcons[category.toLowerCase()] || categoryIcons.default;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground italic">Faye's Inspiration Map</h1>
          <p className="text-muted-foreground text-sm mt-1">Connecting the dots of your creativity</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Show All
          </Button>
          <button
            onClick={() => setFilter("practiced")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-all",
              filter === "practiced"
                ? "bg-primary/20 text-primary border-primary"
                : "text-muted-foreground border-border hover:border-primary"
            )}
          >
            <span className="size-2 rounded-full bg-primary" />
            Practiced
          </button>
          <button
            onClick={() => setFilter("unpracticed")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-all",
              filter === "unpracticed"
                ? "bg-secondary text-foreground border-border"
                : "text-muted-foreground border-border hover:border-foreground"
            )}
          >
            <span className="size-2 rounded-full bg-muted-foreground" />
            Unpracticed
          </button>
        </div>
      </div>

      {/* Canvas with grid background */}
      <div 
        className="flex-1 relative overflow-auto"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading inspirations...</p>
          </div>
        ) : filteredInspirations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No inspirations yet. Add your first spark!</p>
          </div>
        ) : (
          /* Bubbles */
          filteredInspirations.map((item, index) => {
            const pos = getBubblePosition(index, filteredInspirations.length);
            const size = getBubbleSize(index);
            const Icon = getIcon(item.category);
            const floatClass = floatClasses[index % floatClasses.length];

            return (
              <motion.div
                key={item.id}
                className={cn(
                  "absolute cursor-pointer rounded-full border-2 flex flex-col items-center justify-center text-center p-3",
                  floatClass,
                  item.is_practiced
                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_25px_rgba(242,54,101,0.15)]"
                    : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                )}
                style={{
                  left: pos.x,
                  top: pos.y,
                  width: size,
                  height: size,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
                onHoverStart={() => setHoveredId(item.id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                <Icon className="size-5 mb-1" />
                <span className="text-xs font-medium leading-tight line-clamp-2">
                  {item.title || item.content.slice(0, 20)}
                </span>
                {!item.is_practiced && (
                  <span className="text-[10px] uppercase tracking-wide opacity-60 mt-0.5">New Goal</span>
                )}
                {item.is_practiced && (
                  <div className="absolute -top-1 -right-1 size-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card rounded-full p-2 border border-border shadow-card">
        <button className="size-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground">
          <ZoomIn className="size-4" />
        </button>
        <button className="size-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground">
          <ZoomOut className="size-4" />
        </button>
        <button className="size-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground">
          <Hand className="size-4" />
        </button>
        <Button size="sm" className="gap-1.5 shadow-glow">
          <Plus className="size-4" />
          Add New Spark
        </Button>
      </div>
    </div>
  );
};
