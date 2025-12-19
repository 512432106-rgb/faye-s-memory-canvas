import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Palette, Dumbbell, Book, Globe, UtensilsCrossed, Flower2, Check, Plus, ZoomIn, ZoomOut, Hand, Gamepad2, Wine, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type FilterType = "all" | "practiced" | "unpracticed";

interface Inspiration {
  id: string;
  title: string | null;
  content: string;
  category: string | null;
  is_practiced: boolean;
  created_at: string;
}

const categories = [
  { id: "games", label: "Games", emoji: "🎮" },
  { id: "cocktails", label: "Cocktails", emoji: "🍸" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "books", label: "Books", emoji: "📚" },
  { id: "cooking", label: "Cooking", emoji: "👩‍🍳" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "art", label: "Art", emoji: "🎨" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "language", label: "Language", emoji: "🌍" },
];

const categoryIcons: Record<string, typeof Sparkles> = {
  fitness: Dumbbell,
  art: Palette,
  cooking: UtensilsCrossed,
  nature: Flower2,
  books: Book,
  language: Globe,
  games: Gamepad2,
  cocktails: Wine,
  travel: Plane,
  default: Sparkles,
};

const floatClasses = ["animate-float-slow", "animate-float-medium", "animate-float-fast"];

interface BubbleViewProps {
  onAddNew?: () => void;
}

export const BubbleView = ({ onAddNew }: BubbleViewProps) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>("all");
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inspiration | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPracticed, setEditPracticed] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const handleDoubleClick = (item: Inspiration) => {
    setEditingItem(item);
    setEditTitle(item.title || "");
    setEditContent(item.content);
    setEditCategory(item.category || "");
    setEditPracticed(item.is_practiced);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("inspirations")
        .update({
          title: editTitle || null,
          content: editContent,
          category: editCategory || null,
          is_practiced: editPracticed,
        })
        .eq("id", editingItem.id);

      if (error) throw error;

      toast({ title: "Inspiration updated!" });
      setEditDialogOpen(false);
      fetchInspirations();
    } catch (error) {
      console.error("Error updating inspiration:", error);
      toast({ title: "Failed to update", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0">
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

      {/* Canvas - takes remaining height */}
      <div className="flex-1 relative overflow-auto corkboard-pattern min-h-0">
        <div className="absolute inset-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading inspirations...</p>
            </div>
          ) : filteredInspirations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No inspirations yet. Add your first spark!</p>
            </div>
          ) : (
            filteredInspirations.map((item, index) => {
              const pos = getBubblePosition(index, filteredInspirations.length);
              const size = getBubbleSize(index);
              const Icon = getIcon(item.category);
              const floatClass = floatClasses[index % floatClasses.length];

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute z-10 cursor-pointer rounded-full border-2 flex flex-col items-center justify-center text-center p-3",
                    floatClass,
                    item.is_practiced
                      ? "bg-primary/20 border-primary text-primary shadow-[0_0_25px_rgba(242,54,101,0.15)]"
                      : "bg-secondary/70 border-border text-foreground/80 shadow-card hover:border-primary/50"
                  )}
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  onDoubleClick={() => handleDoubleClick(item)}
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
        <Button size="sm" className="gap-1.5 shadow-glow" onClick={onAddNew}>
          <Plus className="size-4" />
          Add New Spark
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Inspiration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium">Title</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Give it a name..."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Content</Label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Describe your idea..."
                className="mt-1.5 min-h-[100px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Practiced</Label>
              <Switch
                checked={editPracticed}
                onCheckedChange={setEditPracticed}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
