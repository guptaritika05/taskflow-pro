import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let projects = [];
        let allTasks = [];
        
        if (user?.role === 'admin') {
          const projectsResponse = await api.get('/projects');
          projects = projectsResponse.data.projects;
          
          const tasksResponse = await api.get('/tasks');
          allTasks = tasksResponse.data.tasks;
          
          const tasksWithProjectName = allTasks.map(task => ({
            ...task,
            projectName: task.project?.name || 'Unknown'
          }));
          allTasks = tasksWithProjectName;
          
        } else {
          const projectsResponse = await api.get('/projects');
          projects = projectsResponse.data.projects;
          
          for (const project of projects) {
            const tasksResponse = await api.get(`/tasks/project/${project._id}/tasks`);
            const tasksWithProjectName = tasksResponse.data.tasks.map(task => ({
              ...task,
              projectName: project.name
            }));
            allTasks = [...allTasks, ...tasksWithProjectName];
          }
        }
        
        const completedCount = allTasks.filter(task => task.status === 'completed').length;
        const pendingCount = allTasks.filter(task => task.status !== 'completed').length;
        
        setStats({
          totalProjects: projects.length,
          totalTasks: allTasks.length,
          completedTasks: completedCount,
          pendingTasks: pendingCount
        });
        
        const sortedTasks = allTasks.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentTasks(sortedTasks.slice(0, 5));
        
      } catch (error) {
        console.log('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const statItems = [
    { label: 'Total Projects', value: stats.totalProjects, color: 'border-blue-500' },
    { label: 'Total Tasks', value: stats.totalTasks, color: 'border-green-500' },
    { label: 'Completed Tasks', value: stats.completedTasks, color: 'border-purple-500' },
    { label: 'Pending Tasks', value: stats.pendingTasks, color: 'border-orange-500' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {user?.role === 'admin' 
            ? 'Admin View: Showing data from all users' 
            : 'Your personal workspace'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statItems.map((item, index) => (
          <div key={index} className={`stat-card border-l-4 ${item.color}`}>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">{item.label}</p>
              <p className="text-3xl font-bold text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-800">Recent Tasks</h2>
        </div>
        <div className="card-body">
          {recentTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No tasks yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <p className="text-sm text-gray-500">Project: {task.projectName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.status === 'completed' ? 'badge-completed' :
                    task.status === 'in_progress' ? 'badge-progress' : 'badge-pending'
                  }`}>
                    {task.status === 'in_progress' ? 'In Progress' : task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}