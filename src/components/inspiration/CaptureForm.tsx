import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

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

const quickTags = ["#urgent", "#weekend", "#creative", "#relaxing"];

interface CaptureFormProps {
  onSaved?: () => void;
}

export const CaptureForm = ({ onSaved }: CaptureFormProps) => {
  const { user } = useAuth();
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag && !tags.includes(`#${customTag}`)) {
      setTags((prev) => [...prev, `#${customTag}`]);
      setCustomTag("");
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Please log in to save inspirations", variant: "destructive" });
      return;
    }
    if (!content.trim()) {
      toast({ title: "Please enter your idea", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      // Create title from first few words of content
      const title = content.split(" ").slice(0, 3).join(" ");
      
      const { error } = await supabase.from("inspirations").insert({
        user_id: user.id,
        title,
        content,
        category: category || null,
        is_practiced: false,
      });

      if (error) throw error;

      toast({ title: "Inspiration saved!", description: "Your spark has been added to the map." });
      setContent("");
      setCategory("");
      setTags([]);
      onSaved?.();
    } catch (error) {
      console.error("Error saving inspiration:", error);
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setCategory("");
    setTags([]);
  };

  return (
    <motion.div
      className="p-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-8">
        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full mb-4">
          New Entry
        </span>
        <h1 className="text-4xl font-bold text-foreground">Capture Inspiration</h1>
        <p className="text-muted-foreground mt-2">Keep your creative sparks safe before they fade away.</p>
      </div>

      {/* Form */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-6">
        {/* Category */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <span className="size-2 rounded-full bg-primary" />
            Where does this belong?
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-secondary border-border">
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

        {/* Content */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <Sparkles className="size-4 text-primary" />
            The Idea
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind, Faye? Describe your idea in detail..."
            className="min-h-[150px] bg-secondary border-border"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Quick Tags</label>
          <div className="flex flex-wrap gap-2">
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full border transition-all",
                  tags.includes(tag)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-muted-foreground border-border hover:border-primary"
                )}
              >
                {tag}
              </button>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
                placeholder="+ Add Tag"
                className="px-3 py-1.5 text-xs bg-transparent border border-dashed border-border rounded-full focus:outline-none focus:border-primary w-24"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-glow">
            <Check className="size-4" />
            {saving ? "Saving..." : "Done"}
          </Button>
        </div>
      </div>

      {/* Quote */}
      <div className="mt-8 p-4 bg-card/50 rounded-xl border border-border">
        <p className="text-sm text-muted-foreground italic text-center">
          "Creativity takes courage." — Henri Matisse
        </p>
      </div>
    </motion.div>
  );
};
