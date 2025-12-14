import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickyNote } from "./StickyNote";
import { cn } from "@/lib/utils";

const sampleNotes = [
  {
    id: "1",
    date: "Oct 12",
    title: "Got promoted!",
    content: "Finally happened! My boss called me in and told me the good news. Celebrated with extra large coffee.",
    mood: "happy" as const,
    icon: "smile",
    style: { top: 120, left: 100 },
    rotation: -2,
  },
  {
    id: "2",
    date: "Oct 14",
    title: "Rainy Gloom",
    content: "It's been raining all day. Felt a bit lonely looking out the window. Need to call mom soon.",
    mood: "sad" as const,
    icon: "cloud",
    reflection: "Call her this weekend!",
    style: { top: 150, left: 420 },
    rotation: 1,
  },
  {
    id: "3",
    date: "Oct 18",
    title: "Faye's Bday Party",
    content: "The surprise party was amazing. I didn't expect so many people to show up.",
    mood: "happy" as const,
    icon: "cake",
    style: { top: 340, left: 180 },
    rotation: 3,
  },
  {
    id: "4",
    date: "Oct 20",
    title: "Argument with M",
    content: "We argued about the trip logistics. It felt unnecessary but we were both tired.",
    mood: "sad" as const,
    icon: "frown",
    style: { top: 300, left: 550 },
    rotation: -1,
  },
  {
    id: "5",
    date: "Oct 27",
    title: "Can't Sleep",
    content: "Insomnia struck again. Too many thoughts racing about the project deadline.",
    mood: "sad" as const,
    icon: "moon",
    style: { top: 480, left: 80 },
    rotation: -3,
  },
];

type FilterType = "all" | "happy" | "sad";

export const CanvasReview = () => {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredNotes = sampleNotes.filter((note) => {
    if (filter === "all") return true;
    return note.mood === filter;
  });

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
        {filteredNotes.map((note) => (
          <StickyNote key={note.id} {...note} />
        ))}
      </div>

      {/* FAB */}
      <motion.div 
        className="absolute bottom-6 right-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button size="lg" className="size-14 rounded-full shadow-float p-0">
          <Plus className="size-6" />
        </Button>
      </motion.div>
    </div>
  );
};
