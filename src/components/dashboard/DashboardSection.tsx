import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  Sun, Cloud, CloudRain, Sparkles, Edit, 
  PlusCircle, CheckCircle2, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const moods = [
  { id: "happy", label: "Happy", icon: Sun, hoverColor: "group-hover:text-yellow-400" },
  { id: "calm", label: "Calm", icon: Cloud, hoverColor: "group-hover:text-blue-400" },
  { id: "melancholy", label: "Melancholy", icon: CloudRain, hoverColor: "group-hover:text-indigo-400" },
  { id: "inspired", label: "Inspired", icon: Sparkles, hoverColor: "group-hover:text-primary" },
];

interface DiaryEntry {
  id: string;
  title: string | null;
  content: string;
  mood: string | null;
  entry_date: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  scheduled_time: string | null;
  category: string | null;
}

interface Inspiration {
  id: string;
  title: string | null;
  content: string;
  category: string | null;
  image_url: string | null;
  is_practiced: boolean;
}

interface DashboardSectionProps {
  onSectionChange?: (section: string) => void;
}

export const DashboardSection = ({ onSectionChange }: DashboardSectionProps) => {
  const { user, profile } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);
  
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const greeting = getGreeting();

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }

  useEffect(() => {
    if (user) {
      fetchTodayData();
    }
  }, [user]);

  const fetchTodayData = async () => {
    setLoading(true);
    try {
      // Fetch today's diary entries
      const { data: diaryData } = await supabase
        .from("diary_entries")
        .select("*")
        .eq("entry_date", todayStr)
        .order("created_at", { ascending: false });

      // Fetch today's tasks
      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .eq("task_date", todayStr)
        .order("scheduled_time", { ascending: true });

      // Fetch today's inspirations
      const { data: inspirationsData } = await supabase
        .from("inspirations")
        .select("*")
        .eq("inspiration_date", todayStr)
        .order("created_at", { ascending: false });

      setDiaryEntries(diaryData || []);
      setTasks(tasksData || []);
      setInspirations(inspirationsData || []);

      // Set mood from today's diary entry if exists
      if (diaryData && diaryData.length > 0 && diaryData[0].mood) {
        setSelectedMood(diaryData[0].mood);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      await supabase
        .from("tasks")
        .update({ 
          completed: !completed,
          completed_at: !completed ? new Date().toISOString() : null
        })
        .eq("id", taskId);
      
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: !completed } : t
      ));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const displayName = profile?.display_name || "Faye";
  const lastDiaryEntry = diaryEntries[0];

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-6 md:p-10 lg:p-12">
      {/* Page Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-6 mb-10"
      >
        <div className="flex flex-col gap-1">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
            {format(today, "EEEE, MMMM do")}
          </p>
          <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-foreground">
            {greeting}, {displayName}
          </h2>
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center gap-4 rounded-full border border-border bg-card py-2 px-5 shadow-sm">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">Privacy Mode</p>
            <p className="text-[10px] text-muted-foreground">Blur content</p>
          </div>
          <label className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-muted p-0.5 transition-colors duration-200">
            <div className="h-5 w-5 rounded-full bg-background shadow-sm transition-transform" />
            <input className="invisible absolute" type="checkbox" />
          </label>
        </div>
      </motion.header>

      {/* Mood Tracker Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-primary size-5" />
          <h3 className="text-lg font-bold text-foreground">Daily Check-in</h3>
        </div>
        <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card p-1">
          <div className="flex min-w-max justify-between md:justify-start gap-2 p-2">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`flex flex-1 md:flex-none items-center gap-3 px-5 py-3 rounded-xl transition-all group ${
                  selectedMood === mood.id 
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-muted"
                }`}
              >
                <mood.icon className={`size-5 ${
                  selectedMood === mood.id 
                    ? "text-primary" 
                    : `text-muted-foreground ${mood.hoverColor}`
                } transition-colors`} />
                <span className={`text-sm font-bold ${
                  selectedMood === mood.id 
                    ? "text-primary" 
                    : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Col 1: Diary / Reflection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-6 lg:col-span-1"
        >
          <div className="flex flex-col h-full rounded-3xl border border-border bg-card overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
            <div className="p-6 md:p-8 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Edit className="size-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {lastDiaryEntry ? "Today's Entry" : "No Entry Yet"}
                  </span>
                </div>
                {lastDiaryEntry ? (
                  <>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {lastDiaryEntry.title || "Today's Reflection"}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-4">
                      {lastDiaryEntry.content}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Reflect & Unwind</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      The day is slowing down. Take a moment to capture your thoughts, {displayName}. What was the highlight of today?
                    </p>
                  </>
                )}
              </div>
              <button 
                onClick={() => onSectionChange?.("diary")}
                className="flex items-center justify-center w-full gap-2 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all shadow-lg shadow-primary/20"
              >
                <Edit className="size-4" />
                {lastDiaryEntry ? "View Diary" : "Write Today's Story"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Col 2: Tasks / Focus */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-6 lg:col-span-1"
        >
          <div className="flex flex-col h-full rounded-3xl border border-border bg-card overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-foreground">Daily Focus</h3>
                <button 
                  onClick={() => onSectionChange?.("tasks")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <PlusCircle className="size-6" />
                </button>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 text-center py-8">
                    <p className="text-muted-foreground mb-2">No tasks for today</p>
                    <button 
                      onClick={() => onSectionChange?.("tasks")}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Add your first task
                    </button>
                  </div>
                ) : (
                  tasks.slice(0, 4).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskComplete(task.id, task.completed)}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-background border border-transparent hover:border-border transition-all cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="size-6 text-primary" />
                      ) : (
                        <div className="relative flex items-center justify-center size-6 rounded-full border-2 border-muted-foreground/50 group-hover:border-primary transition-colors">
                          <div className="size-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold transition-all ${
                          task.completed 
                            ? "text-muted-foreground line-through" 
                            : "text-foreground"
                        }`}>
                          {task.title}
                        </span>
                        <span className={`text-xs ${
                          task.completed ? "text-muted-foreground/60" : "text-muted-foreground"
                        }`}>
                          {task.scheduled_time ? format(new Date(`2000-01-01T${task.scheduled_time}`), "h:mm a") : ""} 
                          {task.scheduled_time && task.category ? " • " : ""}
                          {task.category || ""}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {tasks.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs font-medium text-muted-foreground">
                  <span>{completedTasks} of {tasks.length} completed</span>
                  <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Col 3: Inspiration / Spark */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-6 lg:col-span-1"
        >
          <div className="flex flex-col h-full rounded-3xl border border-border bg-card overflow-hidden p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground">Daily Spark</h3>
              <Sparkles className="size-5 text-primary" />
            </div>
            {inspirations.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-8">
                <div className="p-4 bg-primary/10 rounded-2xl mb-4">
                  <Sparkles className="size-8 text-primary" />
                </div>
                <p className="text-muted-foreground mb-2">No inspirations captured today</p>
                <button 
                  onClick={() => onSectionChange?.("inspiration")}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Capture your first spark
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 flex-1">
                  {inspirations.slice(0, 3).map((inspiration) => (
                    <div 
                      key={inspiration.id}
                      className="p-4 rounded-2xl bg-background border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-foreground line-clamp-1">
                          {inspiration.title || "Untitled"}
                        </h4>
                        {inspiration.category && (
                          <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            {inspiration.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {inspiration.content}
                      </p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => onSectionChange?.("inspiration")}
                  className="mt-6 w-full py-3 text-sm font-bold text-muted-foreground hover:text-primary transition-colors border border-dashed border-border rounded-xl"
                >
                  View All Inspirations
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
