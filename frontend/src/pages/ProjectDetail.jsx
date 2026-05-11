import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });

  const loadData = async () => {
    try {
      const projectsResponse = await api.get('/projects');
      const currentProject = projectsResponse.data.projects.find(p => p._id === id);
      setProject(currentProject);
      
      const tasksResponse = await api.get(`/tasks/project/${id}/tasks`);
      setTasks(tasksResponse.data.tasks);
    } catch (error) {
      console.log('Error loading project details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tasks/project/${id}/tasks`, newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
      loadData();
    } catch (error) {
      console.log('Error creating task:', error);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/tasks/${taskId}`, { status: newStatus });
      loadData();
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
        <button onClick={() => navigate('/projects')} className="btn-primary mt-4">
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div>
      <button 
        onClick={() => navigate('/projects')} 
        className="text-blue-600 mb-4 inline-block hover:underline"
      >
        Back to Projects
      </button>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600 mt-2">{project.description || 'No description provided'}</p>
        </div>
        <button onClick={() => setShowTaskModal(true)} className="btn-primary">
          Add New Task
        </button>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks yet. Click the button above to add tasks.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority} priority
                  </span>
                </div>
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  className="ml-4 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="input-field"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)} 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}