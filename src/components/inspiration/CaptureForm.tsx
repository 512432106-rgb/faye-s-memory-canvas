import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const categories = [
  { id: "games", label: "Games", emoji: "🎮" },
  { id: "cocktails", label: "Cocktails", emoji: "🍸" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "books", label: "Books", emoji: "📚" },
  { id: "cooking", label: "Cooking", emoji: "👩‍🍳" },
  { id: "fitness", label: "Fitness", emoji: "💪" },
];

const quickTags = ["#urgent", "#weekend", "#creative", "#relaxing"];

interface CaptureFormProps {
  onSave?: (idea: { category: string; content: string; tags: string[] }) => void;
}

export const CaptureForm = ({ onSave }: CaptureFormProps) => {
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

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

  const handleSave = () => {
    if (category && content.trim()) {
      onSave?.({ category, content, tags });
      setContent("");
      setCategory("");
      setTags([]);
    }
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
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} className="gap-2 shadow-glow">
            <Check className="size-4" />
            Done
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
