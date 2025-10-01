import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Search, Filter, Calendar, Clock, User, Tag, AlertTriangle, Star, MoreVertical, CreditCard as Edit, Trash2, Eye, MessageSquare, Paperclip, CheckSquare, Settings, Users, Target, TrendingUp } from 'lucide-react';
import { Task, TaskBoard as TaskBoardType, TaskColumn } from '../../types/tasks';
import { loadTasks, saveTasks, updateTask, loadTaskBoards, saveTaskBoards } from '../../data/tasks.mock';
import { getEmployees } from '../../data/employees.mock';
import { Employee } from '../../types/hrms';
import toast from 'react-hot-toast';

interface TaskCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit, onDelete }) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'call': return '📞';
      case 'meeting': return '🤝';
      case 'email': return '📧';
      case 'documentation': return '📄';
      default: return '📋';
    }
  };

  const isOverdue = (dueDate: string, status: Task['status']) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg shadow-sm border-l-4 p-4 mb-3 transition-all hover:shadow-md ${
            getPriorityColor(task.priority)
          } ${snapshot.isDragging ? 'rotate-2 shadow-lg' : ''}`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{getTypeIcon(task.type)}</span>
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{task.title}</h4>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-400 hover:text-blue-600 rounded"
                title="Edit Task"
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-400 hover:text-red-600 rounded"
                title="Delete Task"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span className="truncate max-w-20">{task.assignedTo.split(' ')[0]}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span className={isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : ''}>
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
              {task.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{task.tags.length - 2}</span>
              )}
            </div>
          )}

          {task.progressPercentage > 0 && (
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${task.progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{task.progressPercentage}% complete</div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              {task.comments.length > 0 && (
                <div className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {task.comments.length}
                </div>
              )}
              {task.attachments.length > 0 && (
                <div className="flex items-center">
                  <Paperclip className="h-3 w-3 mr-1" />
                  {task.attachments.length}
                </div>
              )}
              {task.subtasks.length > 0 && (
                <div className="flex items-center">
                  <CheckSquare className="h-3 w-3 mr-1" />
                  {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                </div>
              )}
            </div>
            {isOverdue(task.dueDate, task.status) && (
              <div className="flex items-center text-red-600">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Overdue
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

interface TaskColumnProps {
  column: TaskColumn;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskColumnComponent: React.FC<TaskColumnProps> = ({ column, tasks, onEditTask, onDeleteTask }) => {
  const getColumnColor = (color: string) => {
    return {
      backgroundColor: `${color}10`,
      borderColor: `${color}40`
    };
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-4 min-h-[600px] w-80">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: column.color }}
          ></div>
          <h3 className="font-semibold text-slate-50">{column.name}</h3>
          <span className="ml-2 px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full">
            {tasks.length}
          </span>
        </div>
        <button className="p-1 text-slate-400 hover:text-slate-50 rounded">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[500px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50/10 border-2 border-dashed border-blue-400/50 rounded-lg' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskBoards, setTaskBoards] = useState<TaskBoardType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [currentBoard, setCurrentBoard] = useState<TaskBoardType | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [tasksData, boardsData, employeesData] = await Promise.all([
          loadTasks(),
          loadTaskBoards(),
          getEmployees()
        ]);
        
        setTasks(tasksData);
        setTaskBoards(boardsData);
        setEmployees(employeesData);
        setCurrentBoard(boardsData.find(b => b.isDefault) || boardsData[0] || null);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load task board');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Listen for task updates
    const handleTasksUpdate = () => {
      setTasks(loadTasks());
    };

    window.addEventListener('tasksUpdated', handleTasksUpdate);
    return () => window.removeEventListener('tasksUpdated', handleTasksUpdate);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const task = tasks.find(t => t.id === draggableId);
    if (!task || !currentBoard) return;

    const destinationColumn = currentBoard.columns.find(c => c.id === destination.droppableId);
    if (!destinationColumn) return;

    const updatedTask: Task = {
      ...task,
      status: destinationColumn.status,
      updatedAt: new Date().toISOString(),
      startedAt: destinationColumn.status === 'in-progress' && !task.startedAt ? new Date().toISOString() : task.startedAt,
      completedAt: destinationColumn.status === 'completed' ? new Date().toISOString() : undefined
    };

    updateTask(updatedTask);
    setTasks(prev => prev.map(t => t.id === draggableId ? updatedTask : t));
    toast.success(`Task moved to ${destinationColumn.name}`);
  };

  const handleEditTask = (task: Task) => {
    // This would open an edit modal - for now just show a toast
    toast.info('Edit task functionality would open here');
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      toast.success('Task deleted successfully!');
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = !searchTerm || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAssignee = !selectedAssignee || task.assignedTo === selectedAssignee;
      const matchesPriority = !selectedPriority || task.priority === selectedPriority;

      return matchesSearch && matchesAssignee && matchesPriority;
    });
  }, [tasks, searchTerm, selectedAssignee, selectedPriority]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    if (!currentBoard) return {};
    
    const grouped: Record<string, Task[]> = {};
    currentBoard.columns.forEach(column => {
      grouped[column.id] = filteredTasks.filter(task => task.status === column.status);
    });
    
    return grouped;
  }, [filteredTasks, currentBoard]);

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: filteredTasks.length,
      completed: filteredTasks.filter(t => t.status === 'completed').length,
      inProgress: filteredTasks.filter(t => t.status === 'in-progress').length,
      overdue: filteredTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
    };
  }, [filteredTasks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading task board...</p>
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-slate-700/30 rounded-full w-16 h-16 mx-auto mb-4">
            <Target className="h-8 w-8 text-slate-400 mx-auto mt-2" />
          </div>
          <h3 className="text-lg font-medium text-slate-50 mb-2">No Task Board Found</h3>
          <p className="text-slate-400">Please create a task board to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-50 mb-2">Task Board</h1>
            <p className="text-slate-400">Manage tasks with drag-and-drop kanban board</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <select
              value={currentBoard.id}
              onChange={(e) => {
                const board = taskBoards.find(b => b.id === e.target.value);
                setCurrentBoard(board || null);
              }}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
            >
              {taskBoards.map(board => (
                <option key={board.id} value={board.id}>{board.name}</option>
              ))}
            </select>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-50 bg-purple-600 border border-transparent rounded-lg shadow-sm hover:bg-purple-700 transition-all">
              <Settings className="h-4 w-4 mr-2" />
              Board Settings
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-50">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CheckSquare className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-slate-50">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">In Progress</p>
                <p className="text-2xl font-bold text-slate-50">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Overdue</p>
                <p className="text-2xl font-bold text-slate-50">{stats.overdue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Search Tasks</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="Search tasks..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Assignee</label>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Assignees</option>
                {Array.from(new Set(tasks.map(t => t.assignedTo))).map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              >
                <option value="">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 overflow-x-auto pb-6">
            {currentBoard.columns
              .sort((a, b) => a.order - b.order)
              .map(column => (
                <TaskColumnComponent
                  key={column.id}
                  column={column}
                  tasks={tasksByStatus[column.id] || []}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
          </div>
        </DragDropContext>

        {/* Board Members */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur-xl border border-yellow-400/40 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-50 mb-4">Board Members</h3>
          <div className="flex flex-wrap gap-3">
            {currentBoard.members.map((member, index) => (
              <div key={index} className="flex items-center space-x-2 bg-slate-700/50 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {member.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-slate-50 text-sm">{member}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};