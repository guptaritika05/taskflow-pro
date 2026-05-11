import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const getProjects = async (req, res) => {
  try {
    let projects;
    
    console.log('User role in getProjects:', req.user.role);
    console.log('User id in getProjects:', req.user.id);
    
    if (req.user.role === 'admin') {
      projects = await Project.find({})
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    } else {
      projects = await Project.find({ createdBy: req.user.id })
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
    }
    
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log('User role:', req.user.role);
    console.log('User id:', req.user.id); 
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Project name is required' });
    }
    
    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id
    });
    
    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email');
    
    res.status(201).json({ project: populatedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { name, description, status },
      { new: true }
    ).populate('createdBy', 'name email');
    
    res.status(200).json({ project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    await Task.deleteMany({ project: id });
    await Project.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};