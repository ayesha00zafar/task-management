import { useState } from "react";
import { CalendarIcon, Plus, Sparkles, Target, User } from "lucide-react";
import { format } from "date-fns";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  defaultStatus: Task['status'];
}

const priorityConfig = {
  low: { icon: "🟢", color: "text-status-todo-foreground" },
  medium: { icon: "🟡", color: "text-status-progress-foreground" },
  high: { icon: "🔴", color: "text-destructive" }
};

export function AddTaskDialog({ isOpen, onOpenChange, onAddTask, defaultStatus }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task['priority']>("medium");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      status: defaultStatus,
      priority,
      assignee: assignee.trim() || undefined,
      dueDate,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignee("");
    setDueDate(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-card border-border/50 animate-scale-in">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center animate-bounce-in">
              <Plus className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-black">
                Create New Task
              </span>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Add a new task to your project board
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2 font-semibold">
              <Target className="w-4 h-4 text-primary" />
              Task Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a clear, descriptive task title..."
              className="font-medium border-border/50 focus:border-primary/50 transition-all duration-300"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-accent" />
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              rows={3}
              className="resize-none border-border/50 focus:border-accent/50 transition-all duration-300"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="font-semibold">Priority Level</Label>
              <Select value={priority} onValueChange={(value: Task['priority']) => setPriority(value)}>
                <SelectTrigger className="border-border/50 hover:border-primary/50 transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/50">
                  <SelectItem value="low" className="hover:bg-status-todo-glow/20">
                    <div className="flex items-center gap-2">
                      <span>🟢</span>
                      <span>Low Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium" className="hover:bg-status-progress-glow/20">
                    <div className="flex items-center gap-2">
                      <span>🟡</span>
                      <span>Medium Priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high" className="hover:bg-destructive/20">
                    <div className="flex items-center gap-2">
                      <span>🔴</span>
                      <span>High Priority</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignee" className="flex items-center gap-2 font-semibold">
                <User className="w-4 h-4 text-accent" />
                Assignee
              </Label>
              <Input
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Who's working on this?"
                className="border-border/50 focus:border-accent/50 transition-all duration-300"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2 font-semibold">
              <CalendarIcon className="w-4 h-4 text-primary" />
              Due Date (Optional)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-border/50 hover:border-primary/50 transition-all duration-300"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select a due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-card border-border/50" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex gap-3 pt-6 border-t border-border/50">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300 font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border/50 hover:bg-muted/50 transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}