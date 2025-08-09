import { Plus, MoreVertical } from "lucide-react";
import { Column, Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface KanbanColumnProps {
  column: Column;
  onAddTask: (status: Task['status']) => void;
}

const columnConfig = {
  todo: {
    header: "bg-gradient-to-r from-status-todo to-status-todo-glow text-status-todo-foreground",
    border: "border-status-todo-glow/50",
    accent: "status-todo-glow",
    emoji: "📋",
    gradient: "from-status-todo/20 to-status-todo-glow/20"
  },
  progress: {
    header: "bg-gradient-to-r from-status-progress to-status-progress-glow text-status-progress-foreground",
    border: "border-status-progress-glow/50",
    accent: "status-progress-glow", 
    emoji: "⚡",
    gradient: "from-status-progress/20 to-status-progress-glow/20"
  },
  done: {
    header: "bg-gradient-to-r from-status-done to-status-done-glow text-status-done-foreground",
    border: "border-status-done-glow/50",
    accent: "status-done-glow",
    emoji: "✨",
    gradient: "from-status-done/20 to-status-done-glow/20"
  }
};

export function KanbanColumn({ column, onAddTask }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const config = columnConfig[column.status];

  return (
    <Card className={`
      w-80 glass-card border-2 ${config.border}
      bg-gradient-to-br ${config.gradient}
      backdrop-blur-xl hover-lift
      animate-slide-up
    `}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl animate-float">{config.emoji}</div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">{column.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`${config.header} font-bold px-3 py-1 animate-bounce-in`}>
                  {column.tasks.length} task{column.tasks.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onAddTask(column.status)}
              size="sm"
              className="h-8 w-8 p-0 bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-accent/20"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div
          ref={setNodeRef}
          className="space-y-4 min-h-[500px] pb-4"
        >
          <SortableContext
            items={column.tasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.map((task, index) => (
              <div 
                key={task.id} 
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-scale-in"
              >
                <TaskCard task={task} />
              </div>
            ))}
          </SortableContext>
          
          {column.tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground animate-bounce-in">
              <div className="text-5xl mb-3 opacity-50">{config.emoji}</div>
              <p className="text-sm font-medium">No tasks yet</p>
              <p className="text-xs opacity-75">Click + to add your first task</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}