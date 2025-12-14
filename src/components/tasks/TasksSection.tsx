import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, Filter, Plus, MessageSquare, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  note?: string;
  priority?: "high" | "normal";
}

const sampleTasks: Task[] = [
  { id: "1", title: "Morning Yoga & Meditation", startTime: "08:00 AM", endTime: "09:00 AM", completed: true, note: "Felt very stiff today, need to stretch more tomorrow." },
  { id: "2", title: "Deep Work: Project Alpha Design", startTime: "09:30 AM", endTime: "11:30 AM", completed: false, priority: "high" },
  { id: "3", title: "Lunch with Sarah at The Green Bean", startTime: "12:30 PM", endTime: "01:30 PM", completed: false },
  { id: "4", title: "Review Analytics Report", startTime: "03:00 PM", endTime: "04:00 PM", completed: false },
  { id: "5", title: "Read 2 chapters of current book", startTime: "08:00 PM", endTime: "09:00 PM", completed: false },
];

export const TasksSection = () => {
  const [tasks, setTasks] = useState(sampleTasks);
  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
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
          <h1 className="text-4xl font-bold text-foreground">Hello, Faye.</h1>
          <p className="text-muted-foreground mt-1">
            {dayName}, {monthDay} - Here is your flow for today.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-8 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground">Daily Goal Progress</h3>
              <p className="text-sm text-muted-foreground">Keep going, you're doing great.</p>
            </div>
            <span className="text-2xl font-bold text-foreground">
              {completedCount}/{tasks.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Tasks List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Today's Tasks</h2>
            <button className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
              <Filter className="size-4" />
              Filter
            </button>
          </div>

          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              className={cn(
                "bg-card rounded-xl border p-4 transition-all",
                task.completed ? "border-primary/30 opacity-75" : "border-border"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className={cn(
                      "size-5 rounded border-2",
                      task.completed && "bg-primary border-primary"
                    )}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-medium text-foreground",
                    task.completed && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "size-1.5 rounded-full",
                      task.priority === "high" ? "bg-primary" : "bg-muted-foreground"
                    )} />
                    <span className="text-xs text-muted-foreground">
                      {task.startTime} - {task.endTime}
                    </span>
                  </div>
                  
                  {task.note && (
                    <div className="mt-3 p-3 bg-secondary/50 rounded-lg border-l-2 border-primary">
                      <p className="text-sm text-muted-foreground italic">"{task.note}"</p>
                    </div>
                  )}
                </div>

                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <GripVertical className="size-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <motion.div
        className="fixed bottom-6 right-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button size="lg" className="size-14 rounded-full shadow-float p-0">
          <Plus className="size-6" />
        </Button>
      </motion.div>
    </motion.div>
  );
};
