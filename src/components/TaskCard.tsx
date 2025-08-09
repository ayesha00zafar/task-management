import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { Calendar, User, Clock, AlertCircle, CheckCircle, Circle } from 'lucide-react';
import { format, differenceInDays, isToday, isPast } from 'date-fns';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityConfig = {
    low: { color: 'bg-blue-500', icon: Circle, variant: 'outline' as const },
    medium: { color: 'bg-yellow-500', icon: AlertCircle, variant: 'secondary' as const },
    high: { color: 'bg-red-500', icon: AlertCircle, variant: 'destructive' as const },
  };

  const getTimeRemaining = () => {
    if (!task.dueDate) return null;
    
    const today = new Date();
    const days = differenceInDays(task.dueDate, today);
    
    if (isPast(task.dueDate) && !isToday(task.dueDate)) {
      return `${Math.abs(days)} days overdue`;
    } else if (isToday(task.dueDate)) {
      return 'Due today';
    } else if (days === 1) {
      return 'Due tomorrow';
    } else if (days > 0) {
      return `${days} days left`;
    }
    return null;
  };

  const getTimeRemainingVariant = () => {
    if (!task.dueDate) return 'outline';
    
    const today = new Date();
    const days = differenceInDays(task.dueDate, today);
    
    if (isPast(task.dueDate) && !isToday(task.dueDate)) return 'destructive';
    if (isToday(task.dueDate)) return 'destructive';
    if (days <= 2) return 'secondary';
    return 'outline';
  };

  const PriorityIcon = priorityConfig[task.priority].icon;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        cursor-grab active:cursor-grabbing
        bg-card border border-border shadow-sm
        transition-all duration-200 hover:shadow-md
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
      `}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
          <div className="flex items-center gap-1">
            <div 
              className={`w-2 h-2 rounded-full ${priorityConfig[task.priority].color}`}
            />
            <Badge variant={priorityConfig[task.priority].variant} className="text-xs">
              {task.priority}
            </Badge>
          </div>
        </div>

        {task.description && (
          <p className="text-muted-foreground text-xs line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="space-y-2">
          {task.dueDate && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Due: {format(task.dueDate, 'MMM d, yyyy')}</span>
              </div>
              {getTimeRemaining() && (
                <Badge 
                  variant={getTimeRemainingVariant()} 
                  className="text-xs py-0 px-2 h-5"
                >
                  {getTimeRemaining()}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {task.assignee && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{task.assignee}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{task.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}