import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  Sun, Cloud, CloudRain, Sparkles, Edit, 
  PlusCircle, CheckCircle2, Circle
} from "lucide-react";

const moods = [
  { id: "happy", label: "Happy", icon: Sun, hoverColor: "group-hover:text-yellow-400" },
  { id: "calm", label: "Calm", icon: Cloud, hoverColor: "group-hover:text-blue-400" },
  { id: "melancholy", label: "Melancholy", icon: CloudRain, hoverColor: "group-hover:text-indigo-400" },
  { id: "inspired", label: "Inspired", icon: Sparkles, hoverColor: "group-hover:text-primary" },
];

const tasks = [
  { id: 1, title: "Morning Meditation", subtitle: "15 mins • Wellness", completed: false },
  { id: 2, title: "Draft design concepts", subtitle: "Completed 2:30 PM", completed: true },
  { id: 3, title: "Read 20 pages", subtitle: "Evening Routine", completed: false },
];

const inspirationImages = [
  "https://images.unsplash.com/photo-1557683316-973673bdar29?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
];

export const DashboardSection = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>("inspired");
  const today = new Date();
  const greeting = getGreeting();
  const completedTasks = tasks.filter(t => t.completed).length;

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
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
            {greeting}, Faye
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
                    Last Entry: Yesterday
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Reflect & Unwind</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  The day is slowing down. Take a moment to capture your thoughts, Faye. What was the highlight of today?
                </p>
              </div>
              <button className="flex items-center justify-center w-full gap-2 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all shadow-lg shadow-primary/20">
                <Edit className="size-4" />
                Write Today's Story
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
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <PlusCircle className="size-6" />
                </button>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                {tasks.map((task) => (
                  <div
                    key={task.id}
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
                          : "text-foreground group-hover:line-through"
                      }`}>
                        {task.title}
                      </span>
                      <span className={`text-xs ${
                        task.completed ? "text-muted-foreground/60" : "text-muted-foreground"
                      }`}>
                        {task.subtitle}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs font-medium text-muted-foreground">
                <span>{completedTasks} of {tasks.length} completed</span>
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(completedTasks / tasks.length) * 100}%` }}
                  />
                </div>
              </div>
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
            {/* Masonry-ish Grid */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden min-h-[140px] group bg-gradient-to-br from-primary/20 to-purple-500/20">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
                <div className="absolute bottom-3 left-3 z-20">
                  <p className="text-white font-bold text-sm leading-tight drop-shadow-md">
                    "Simplicity is the ultimate sophistication."
                  </p>
                </div>
                <div 
                  className="bg-center bg-cover h-full w-full transform group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${inspirationImages[0]})` }}
                />
              </div>
              <div className="col-span-1 aspect-square rounded-2xl overflow-hidden relative group bg-muted">
                <div 
                  className="bg-center bg-cover h-full w-full transform group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url(${inspirationImages[1]})` }}
                />
              </div>
              <div className="col-span-1 aspect-square rounded-2xl overflow-hidden relative group bg-muted">
                <div 
                  className="bg-center bg-cover h-full w-full transform group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundImage: `url(${inspirationImages[2]})` }}
                />
              </div>
            </div>
            <button className="mt-6 w-full py-3 text-sm font-bold text-muted-foreground hover:text-primary transition-colors border border-dashed border-border rounded-xl">
              + Add to Vision Board
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
