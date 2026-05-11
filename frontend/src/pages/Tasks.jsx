import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let tasksData = [];
        
        if (user?.role === 'admin') {
          const response = await api.get('/tasks');
          tasksData = response.data.tasks.map(task => ({
            ...task,
            projectName: task.project?.name || 'Unknown'
          }));
        } else {
          const projectsResponse = await api.get('/projects');
          const projects = projectsResponse.data.projects;
          
          for (const project of projects) {
            const tasksResponse = await api.get(`/tasks/project/${project._id}/tasks`);
            const tasksWithProject = tasksResponse.data.tasks.map(task => ({
              ...task,
              projectName: project.name
            }));
            tasksData = [...tasksData, ...tasksWithProject];
          }
        }
        
        const sortedTasks = tasksData.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTasks(sortedTasks);
        
      } catch (error) {
        console.log('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.log('Error updating task:', error);
      alert(error.response?.data?.message || 'Failed to update task');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      <p className="text-gray-500 mb-6">
        {user?.role === 'admin' 
          ? 'Admin View: Showing all tasks from all users' 
          : 'Your tasks across all projects'}
      </p>
      
      <div className="card">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Task</th>
                  <th className="table-header">Project</th>
                  <th className="table-header">Priority</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="table-row">
                    <td className="table-cell">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-gray-500">{task.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">{task.projectName}</td>
                    <td className="table-cell">
                      <span className={`badge-${task.priority}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="table-cell">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className="dropdown text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="table-cell">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}