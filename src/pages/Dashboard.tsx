import { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ProjectHeader } from '@/components/ProjectHeader';
import { KanbanColumn } from '@/components/KanbanColumn';
import { AddTaskDialog } from '@/components/AddTaskDialog';
import { TeamChat } from '@/components/TeamChat';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { DashboardCalendar } from '@/components/DashboardCalendar';
import { Task, Column } from '@/types/task';
import { toast } from '@/hooks/use-toast';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

interface DatabaseTask {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<Task['status']>('todo');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedTasks: Task[] = (data as DatabaseTask[]).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee || undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
      }));

      setTasks(transformedTasks);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const columns: Column[] = useMemo(() => {
    const statusGroups = filteredTasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    return [
      {
        id: 'todo',
        title: 'To Do',
        status: 'todo' as const,
        tasks: statusGroups.todo || [],
      },
      {
        id: 'progress',
        title: 'In Progress',
        status: 'progress' as const,
        tasks: statusGroups.progress || [],
      },
      {
        id: 'done',
        title: 'Done',
        status: 'done' as const,
        tasks: statusGroups.done || [],
      },
    ];
  }, [filteredTasks]);

  const taskCounts = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    progress: tasks.filter(t => t.status === 'progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }), [tasks]);

  const handleAddTask = async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          priority: newTask.priority,
          assignee: newTask.assignee,
          due_date: newTask.dueDate?.toISOString(),
          user_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;

      const transformedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        status: data.status as Task['status'],
        priority: data.priority as Task['priority'],
        assignee: data.assignee || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
      };

      setTasks(prev => [transformedTask, ...prev]);
      setIsAddTaskOpen(false);
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleAddTaskClick = (status: Task['status']) => {
    setDefaultTaskStatus(status);
    setIsAddTaskOpen(true);
  };

  const findContainer = (id: string) => {
    const task = tasks.find(t => t.id === id);
    return task?.status;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic if needed
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTaskId(null);
    
    const { active, over } = event;
    
    if (!over) return;
    
    const activeTaskId = active.id as string;
    const overContainer = over.id as string;
    
    const activeContainer = findContainer(activeTaskId);
    
    if (activeContainer === overContainer) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: overContainer })
        .eq('id', activeTaskId);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === activeTaskId 
          ? { ...task, status: overContainer as Task['status'] }
          : task
      ));

      toast({
        title: "Success",
        description: "Task status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto p-6 space-y-8">
        <ProjectHeader 
          taskCounts={taskCounts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddTask={() => handleAddTaskClick('todo')}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {columns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    onAddTask={handleAddTaskClick}
                  />
                ))}
              </div>
            </DndContext>
          </div>
          
          <div className="space-y-6">
            <DashboardCalendar tasks={tasks} />
            <TeamChat />
          </div>
        </div>
      </div>

      <AddTaskDialog
        isOpen={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAddTask={handleAddTask}
        defaultStatus={defaultTaskStatus}
      />
    </div>
  );
}