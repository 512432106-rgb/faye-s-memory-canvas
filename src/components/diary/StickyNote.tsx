import { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Frown, Cloud, Sun, Cake, Moon, Edit3, Send } from "lucide-react";
import { cn } from "@/lib/utils";

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
  date,
  title,
  content,
  mood,
  icon = "smile",
  reflection,
  style,
  rotation = 0,
}: StickyNoteProps) => {
  const [showInput, setShowInput] = useState(false);
  const [newReflection, setNewReflection] = useState("");
  
  const IconComponent = iconMap[icon] || Smile;
  const isHappy = mood === "happy";

  return (
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
  );
};
