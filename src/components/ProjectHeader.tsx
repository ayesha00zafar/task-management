import { Calendar, Filter, Plus, Search, Users, Sparkles, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

interface ProjectHeaderProps {
  onAddTask: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  taskCounts: {
    total: number;
    todo: number;
    progress: number;
    done: number;
  };
}

export function ProjectHeader({ onAddTask, searchQuery, onSearchChange, taskCounts }: ProjectHeaderProps) {
  const completionRate = taskCounts.total > 0 ? Math.round((taskCounts.done / taskCounts.total) * 100) : 0;

  return (
    <div className="bg-gradient-hero p-8 rounded-2xl shadow-glass text-primary-foreground mb-8 relative overflow-hidden animate-slide-up">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/20 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-accent animate-glow" />
                <h1 className="text-4xl font-black tracking-tight">TaskForge</h1>
              </div>
              <Badge className="bg-accent/20 text-accent-foreground border-accent/30 animate-bounce-in">
                Pro
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm opacity-90">
              <div className="flex items-center gap-2 hover-scale">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2 hover-scale">
                <Users className="w-4 h-4" />
                <span className="font-medium">Team Project</span>
              </div>
              <div className="flex items-center gap-2 hover-scale">
                <Target className="w-4 h-4" />
                <span className="font-medium">{completionRate}% Complete</span>
              </div>
              <div className="flex items-center gap-2 hover-scale">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">On Track</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-white/20 text-primary-foreground border-white/30 px-4 py-2 font-bold animate-bounce-in" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
                  {taskCounts.total} Total
                </div>
              </Badge>
              <Badge className="bg-status-todo-glow/30 text-primary-foreground border-status-todo-glow/50 px-4 py-2 font-bold animate-bounce-in" style={{animationDelay: '0.2s'}}>
                📋 {taskCounts.todo} Todo
              </Badge>
              <Badge className="bg-status-progress-glow/30 text-primary-foreground border-status-progress-glow/50 px-4 py-2 font-bold animate-bounce-in" style={{animationDelay: '0.3s'}}>
                ⚡ {taskCounts.progress} Active
              </Badge>
              <Badge className="bg-status-done-glow/30 text-primary-foreground border-status-done-glow/50 px-4 py-2 font-bold animate-bounce-in" style={{animationDelay: '0.4s'}}>
                ✨ {taskCounts.done} Done
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 w-64 glass border-white/30 text-primary-foreground placeholder:text-primary-foreground/70 hover:border-white/50 focus:border-accent transition-all duration-300"
                />
              </div>
              
              <ThemeToggle />
              
              <Button
                variant="secondary"
                size="sm"
                className="glass text-primary-foreground border-white/30 hover:bg-white/30 hover:shadow-glow transition-all duration-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <Button
                onClick={onAddTask}
                size="sm"
                className="bg-accent hover:bg-accent-glow text-accent-foreground font-bold shadow-glow hover:shadow-xl transition-all duration-300 hover-scale"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium opacity-90">Project Progress</span>
            <span className="font-bold">{completionRate}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-accent to-accent-glow h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}