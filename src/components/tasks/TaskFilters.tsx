import React from 'react';
import { TaskFilters, TaskPriority, TaskStatus } from '../../types';

interface Props {
  onFilterChange: (filters: TaskFilters) => void;
}

const TaskFiltersComponent: React.FC<Props> = ({ onFilterChange }) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: e.target.value as TaskStatus });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ priority: e.target.value as TaskPriority });
  };

  return (
    <div className="mb-4">
      <select onChange={handleStatusChange} className="mr-2">
        <option value="">All Status</option>
        <option value={TaskStatus.TODO}>Todo</option>
        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
        <option value={TaskStatus.DONE}>Done</option>
      </select>

      <select onChange={handlePriorityChange}>
        <option value="">All Priority</option>
        <option value={TaskPriority.LOW}>Low</option>
        <option value={TaskPriority.MEDIUM}>Medium</option>
        <option value={TaskPriority.HIGH}>High</option>
      </select>
    </div>
  );
};

export default TaskFiltersComponent;
