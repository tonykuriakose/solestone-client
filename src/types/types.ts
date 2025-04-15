export interface User {
  id: string;
  name?: string;
  email: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  userId: string;
  createdAt: Date;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  search?: string;
};

export interface AIMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  metadata?: {
    referencedTasks?: string[];
    actionType?: 'query' | 'create' | 'update';
  };
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
}
