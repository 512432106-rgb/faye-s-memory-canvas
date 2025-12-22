import { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Frown, Cloud, Sun, Cake, Moon, Edit3, Send, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StickyNoteProps {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: "happy" | "sad";
  icon?: string;
  reflection?: string;
  style?: React.CSSProperties;
  rotation?: number;
  onUpdate?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  smile: Smile,
  frown: Frown,
  cloud: Cloud,
  sun: Sun,
  cake: Cake,
  moon: Moon,
};

export const StickyNote = ({
  id,
  date,
  title,
  content,
  mood,
  icon = "smile",
  reflection,
  style,
  rotation = 0,
  onUpdate,
}: StickyNoteProps) => {
  const { toast } = useToast();
  const [showInput, setShowInput] = useState(false);
  const [newReflection, setNewReflection] = useState("");
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [editMood, setEditMood] = useState<string>(mood);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const IconComponent = iconMap[icon] || Smile;
  const isHappy = mood === "happy";

  const handleDoubleClick = () => {
    setEditTitle(title);
    setEditContent(content);
    setEditMood(mood);
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("diary_entries")
        .update({
          title: editTitle,
          content: editContent,
          mood: editMood,
        })
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Entry updated!" });
      setEditDialogOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error updating entry:", error);
      toast({ title: "Failed to update", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("diary_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Entry deleted!" });
      setEditDialogOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({ title: "Failed to delete", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        className={cn(
          "sticky-note absolute w-64 p-5 rounded-xl shadow-card cursor-grab active:cursor-grabbing",
          isHappy 
            ? "bg-primary/10 backdrop-blur-sm border border-primary/20" 
            : "bg-card border border-border"
        )}
        style={{ ...style, transform: `rotate(${rotation}deg)` }}
        whileHover={{ scale: 1.02, y: -4 }}
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onDoubleClick={handleDoubleClick}
      >
        {/* Washi Tape */}
        <div className={cn(
          "washi-tape",
          isHappy ? "bg-primary/30" : "bg-muted-foreground/20"
        )} />

        {/* Header */}
        <div className={cn(
          "flex justify-between items-start mb-3",
          isHappy ? "text-primary" : "text-muted-foreground"
        )}>
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">{date}</span>
          <IconComponent className="size-5" />
        </div>

        {/* Content */}
        <h3 className={cn(
          "font-bold text-lg mb-2",
          isHappy ? "text-foreground" : "text-foreground/80"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-sm leading-relaxed mb-4",
          isHappy ? "text-foreground/70" : "text-muted-foreground"
        )}>
          {content}
        </p>

        {/* Footer */}
        <div className={cn(
          "pt-3 border-t flex justify-between items-center",
          isHappy ? "border-primary/10" : "border-border"
        )}>
          {reflection ? (
            <div className="flex items-center gap-2">
              <div className="size-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                F
              </div>
              <span className="text-xs text-muted-foreground">{reflection}</span>
            </div>
          ) : showInput ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={newReflection}
                onChange={(e) => setNewReflection(e.target.value)}
                placeholder="Add a thought..."
                className="flex-1 bg-transparent text-xs border-none focus:outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button className="text-primary hover:text-primary/80">
                <Send className="size-4" />
              </button>
            </div>
          ) : (
            <>
              <span className="text-xs text-muted-foreground italic">No reflection yet</span>
              <button 
                onClick={() => setShowInput(true)}
                className={cn(
                  "transition-colors",
                  isHappy ? "text-primary hover:text-primary/80" : "text-muted-foreground hover:text-foreground"
                )}
                title="Add reflection"
              >
                <Edit3 className="size-4" />
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Entry title..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Content</label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="What's on your mind..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Mood</label>
              <Select value={editMood} onValueChange={setEditMood}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">😊 Happy</SelectItem>
                  <SelectItem value="loved">❤️ Loved</SelectItem>
                  <SelectItem value="neutral">😐 Neutral</SelectItem>
                  <SelectItem value="sad">😔 Sad</SelectItem>
                  <SelectItem value="anxious">😰 Anxious</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={deleting}
              className="gap-1.5"
            >
              <Trash2 className="size-4" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
