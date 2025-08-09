export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface Column {
  id: string;
  title: string;
  status: 'todo' | 'progress' | 'done';
  tasks: Task[];
}