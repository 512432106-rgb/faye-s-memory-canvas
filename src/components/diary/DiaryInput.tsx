import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, Smile, Meh, Frown, Heart, Star, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const weatherOptions = [
  { id: "sunny", icon: Sun, label: "Sunny" },
  { id: "cloudy", icon: Cloud, label: "Cloudy" },
  { id: "rainy", icon: CloudRain, label: "Rainy" },
];

const moodOptions = [
  { id: "happy", icon: Smile, color: "text-primary" },
  { id: "neutral", icon: Meh, color: "text-muted-foreground" },
  { id: "sad", icon: Frown, color: "text-muted-foreground" },
  { id: "loved", icon: Heart, color: "text-primary" },
];

interface DiaryInputProps {
  onSave?: () => void;
}

export const DiaryInput = ({ onSave }: DiaryInputProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [weather, setWeather] = useState("sunny");
  const [mood, setMood] = useState("happy");
  const [isSaving, setIsSaving] = useState(false);
  
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please write something before saving");
      return;
    }
    if (!user) {
      toast.error("Please log in to save entries");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("diary_entries").insert({
        user_id: user.id,
        title: title.trim() || null,
        content: content.trim(),
        weather,
        mood,
        entry_date: today.toISOString().split('T')[0],
      });

      if (error) throw error;

      toast.success("Diary entry saved!");
      setTitle("");
      setContent("");
      onSave?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save entry");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setTitle("");
    setContent("");
    setWeather("sunny");
    setMood("happy");
  };

  return (
    <motion.div 
      className="flex-1 p-8 overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">New Entry</span>
          <h1 className="text-4xl font-bold text-foreground mt-2">{dayName}, {monthDay}</h1>
          <p className="text-muted-foreground mt-1">What's on your mind, Faye?</p>
        </div>

        {/* Selectors */}
        <div className="flex items-center gap-6 mb-6">
          {/* Weather */}
          <div className="flex items-center gap-2 bg-card rounded-full p-1.5 border border-border">
            {weatherOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setWeather(option.id)}
                className={cn(
                  "size-9 rounded-full flex items-center justify-center transition-all",
                  weather === option.id 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                title={option.label}
              >
                <option.icon className="size-4" />
              </button>
            ))}
          </div>

          {/* Mood */}
          <div className="flex items-center gap-2 bg-card rounded-full p-1.5 border border-border">
            {moodOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setMood(option.id)}
                className={cn(
                  "size-9 rounded-full flex items-center justify-center transition-all",
                  mood === option.id 
                    ? "bg-primary text-primary-foreground" 
                    : cn(option.color, "hover:opacity-80")
                )}
              >
                <option.icon className="size-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          {/* Title Input */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your entry a title..."
            className="bg-transparent border-none text-xl font-bold text-foreground placeholder:text-muted-foreground focus-visible:ring-0 mb-4 px-0"
          />
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dear Diary, today started with a gentle breeze..."
            className="min-h-[350px] bg-transparent border-none resize-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 text-base leading-relaxed"
          />
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Star className="size-3" />
              <span>{content.length} characters</span>
            </div>
            <p className="text-xs text-muted-foreground italic">"Every day is a fresh start."</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" className="gap-2" onClick={handleDiscard}>
            <X className="size-4" />
            Discard
          </Button>
          <Button onClick={handleSave} className="gap-2 shadow-glow" disabled={isSaving}>
            <Save className="size-4" />
            {isSaving ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
