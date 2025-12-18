import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Plus, GripVertical, X, Clock, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  scheduled_time: string | null;
  completed: boolean;
  description?: string | null;
  task_date: string;
  category?: string | null;
}

export const TasksSection = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, selectedDate]);

  const fetchTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('task_date', dateStr)
      .order('scheduled_time', { ascending: true });

    if (error) {
      toast.error("Failed to load tasks");
      console.error(error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const { error } = await supabase
      .from('tasks')
      .update({ 
        completed: !task.completed,
        completed_at: !task.completed ? new Date().toISOString() : null
      })
      .eq('id', id);

    if (error) {
      toast.error("Failed to update task");
    } else {
      setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  const addTask = async () => {
    if (!user || !newTaskTitle.trim()) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: newTaskTitle.trim(),
        scheduled_time: newTaskTime || null,
        task_date: format(selectedDate, 'yyyy-MM-dd')
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add task");
    } else {
      setTasks(prev => [...prev, data].sort((a, b) => {
        if (!a.scheduled_time) return 1;
        if (!b.scheduled_time) return -1;
        return a.scheduled_time.localeCompare(b.scheduled_time);
      }));
      setShowAddDialog(false);
      setNewTaskTitle("");
      setNewTaskTime("");
      toast.success("Task added!");
    }
  };

  const saveNote = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ description: noteText })
      .eq('id', taskId);

    if (error) {
      toast.error("Failed to save note");
    } else {
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, description: noteText } : t
      ));
      setEditingNoteId(null);
      setNoteText("");
      toast.success("Note saved!");
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
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
          <h1 className="text-4xl font-bold text-foreground italic">Hello, Faye.</h1>
          <p className="text-muted-foreground mt-1">
            {dayName}, {monthDay} - {isToday ? "Here is your flow for today." : "Viewing tasks for this day."}
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
            <h2 className="text-xl font-bold text-foreground">
              {isToday ? "Today's Tasks" : `Tasks for ${format(selectedDate, 'MMM d')}`}
            </h2>
            <Popover open={showFilterPopover} onOpenChange={setShowFilterPopover}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors">
                  <Filter className="size-4" />
                  Filter
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                      setShowFilterPopover(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks for this day. Click + to add one!
            </div>
          ) : (
            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  className={cn(
                    "bg-card rounded-xl border p-4 transition-all",
                    task.completed ? "border-primary/30 opacity-75" : "border-border"
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
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
                      {task.scheduled_time && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn(
                            "size-1.5 rounded-full",
                            task.completed ? "bg-primary" : "bg-muted-foreground"
                          )} />
                          <span className="text-xs text-muted-foreground">
                            {formatTime(task.scheduled_time)}
                          </span>
                        </div>
                      )}
                      
                      {/* Note display/edit */}
                      {editingNoteId === task.id ? (
                        <div className="mt-3 space-y-2">
                          <Textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add your reflection..."
                            className="bg-secondary/50 border-primary/30 text-sm"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveNote(task.id)}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => {
                              setEditingNoteId(null);
                              setNoteText("");
                            }}>Cancel</Button>
                          </div>
                        </div>
                      ) : task.description ? (
                        <div 
                          className="mt-3 p-3 bg-secondary/50 rounded-lg border-l-2 border-primary cursor-pointer hover:bg-secondary/70 transition-colors"
                          onClick={() => {
                            setEditingNoteId(task.id);
                            setNoteText(task.description || "");
                          }}
                        >
                          <p className="text-sm text-muted-foreground italic">"{task.description}"</p>
                        </div>
                      ) : (
                        <button
                          className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => {
                            setEditingNoteId(task.id);
                            setNoteText("");
                          }}
                        >
                          <MessageSquare className="size-3" />
                          Add note
                        </button>
                      )}
                    </div>

                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <GripVertical className="size-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* FAB */}
      <motion.div
        className="fixed bottom-6 right-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          size="lg" 
          className="size-14 rounded-full shadow-float p-0"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="size-6" />
        </Button>
      </motion.div>

      {/* Add Task Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Task</label>
              <Input
                placeholder="What do you want to do?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                <Clock className="size-4 inline mr-1" />
                Time (optional)
              </label>
              <Input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <span>For: {format(selectedDate, 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={addTask} disabled={!newTaskTitle.trim()}>Add Task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
