import { useState } from "react";
import { motion } from "framer-motion";
import { Flower2, Palette, Dumbbell, Book, Globe, UtensilsCrossed, Check, Plus, ZoomIn, ZoomOut, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ideas = [
  { id: "1", title: "Morning Yoga", icon: Dumbbell, practiced: true, x: 180, y: 200, size: 100 },
  { id: "2", title: "Watercolor Painting", icon: Palette, practiced: false, isNew: true, x: 480, y: 150, size: 90 },
  { id: "3", title: "Sourdough Starter", icon: UtensilsCrossed, practiced: false, x: 100, y: 350, size: 70 },
  { id: "4", title: "Meditation", icon: Flower2, practiced: false, x: 280, y: 320, size: 75 },
  { id: "5", title: "Balcony Garden", icon: Flower2, practiced: true, x: 150, y: 480, size: 95 },
  { id: "6", title: "Minimalist Decor", icon: Book, practiced: false, x: 350, y: 460, size: 80 },
  { id: "7", title: "French Lessons", icon: Globe, practiced: false, x: 520, y: 380, size: 85 },
];

type FilterType = "all" | "practiced" | "unpracticed";

export const BubbleView = () => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredIdeas = ideas.filter((idea) => {
    if (filter === "all") return true;
    if (filter === "practiced") return idea.practiced;
    return !idea.practiced;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faye's Inspiration Map</h1>
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

      {/* Canvas */}
      <div className="flex-1 relative overflow-auto bg-gradient-to-b from-background to-card">
        {/* Connection Lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(343 88% 58% / 0.3)" />
              <stop offset="100%" stopColor="hsl(343 88% 58% / 0.1)" />
            </linearGradient>
          </defs>
          {/* Sample connection lines */}
          <line x1="230" y1="250" x2="280" y2="320" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="4" />
          <line x1="200" y1="480" x2="280" y2="370" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="4" />
          <line x1="200" y1="480" x2="350" y2="460" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="4" />
        </svg>

        {/* Bubbles */}
        {filteredIdeas.map((idea, index) => (
          <motion.div
            key={idea.id}
            className={cn(
              "bubble absolute cursor-pointer border-2",
              idea.practiced
                ? "bg-primary/20 border-primary text-primary"
                : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
            )}
            style={{
              left: idea.x,
              top: idea.y,
              width: idea.size,
              height: idea.size,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setHoveredId(idea.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            <div className="flex flex-col items-center justify-center text-center p-2">
              <idea.icon className="size-5 mb-1" />
              <span className="text-xs font-medium leading-tight">{idea.title}</span>
              {idea.isNew && (
                <span className="text-[10px] uppercase tracking-wide opacity-60 mt-0.5">New Goal</span>
              )}
              {idea.practiced && (
                <div className="absolute -top-1 -right-1 size-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="size-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
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
