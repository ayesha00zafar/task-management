import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { format, isToday, differenceInDays } from 'date-fns';
import { CalendarDays, Clock } from 'lucide-react';

interface DashboardCalendarProps {
  tasks: Task[];
}

export function DashboardCalendar({ tasks }: DashboardCalendarProps) {
  const today = new Date();
  
  const upcomingTasks = tasks
    .filter(task => task.dueDate && task.status !== 'done')
    .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
    .slice(0, 5);

  const getTimeRemaining = (dueDate: Date) => {
    const days = differenceInDays(dueDate, today);
    
    if (days < 0) {
      return `${Math.abs(days)} days overdue`;
    } else if (days === 0) {
      return 'Due today';
    } else if (days === 1) {
      return 'Due tomorrow';
    } else {
      return `${days} days left`;
    }
  };

  const getTimeRemainingVariant = (dueDate: Date) => {
    const days = differenceInDays(dueDate, today);
    
    if (days < 0) return 'destructive';
    if (days === 0) return 'destructive';
    if (days <= 2) return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5" />
            Today
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(today, 'EEEE, MMMM d, yyyy')}
          </p>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={today}
            className="pointer-events-auto"
            disabled={(date) => date < new Date("1900-01-01")}
          />
        </CardContent>
      </Card>

      {upcomingTasks.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex flex-col gap-2 p-3 rounded-lg bg-muted/50">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                  <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs shrink-0">
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">
                    Due: {task.dueDate && format(task.dueDate, 'MMM d, yyyy')}
                  </p>
                  <Badge 
                    variant={getTimeRemainingVariant(task.dueDate!)} 
                    className="text-xs"
                  >
                    {getTimeRemaining(task.dueDate!)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}