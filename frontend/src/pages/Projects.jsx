import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.log('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { 
        name: projectName, 
        description: projectDescription 
      });
      setProjectName('');
      setProjectDescription('');
      setShowModal(false);
      loadProjects();
    } catch (error) {
      console.log('Error creating project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project? This will also delete all tasks inside it.');
    if (confirmDelete) {
      try {
        await api.delete(`/projects/${projectId}`);
        loadProjects();
      } catch (error) {
        console.log('Error deleting project:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Create New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No projects found.</p>
          <p className="text-gray-400">Click the button above to create your first project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onDelete={handleDeleteProject} 
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="input-field"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}