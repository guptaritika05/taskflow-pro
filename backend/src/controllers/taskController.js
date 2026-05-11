import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    let tasks;
    
    if (req.user.role === 'admin') {
      tasks = await Task.find({})
        .populate('assignedTo', 'name email')
        .populate('project', 'name')
        .sort({ createdAt: -1 });
    } else {
      const userProjects = await Project.find({ createdBy: req.user.id }).select('_id');
      const projectIds = userProjects.map(p => p._id);
      
      tasks = await Task.find({ 
        $or: [
          { project: { $in: projectIds } },
          { assignedTo: req.user.id }
        ]
      })
        .populate('assignedTo', 'name email')
        .populate('project', 'name')
        .sort({ createdAt: -1 });
    }
    
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, dueDate, priority, assignedTo } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const isProjectOwner = project.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isProjectOwner && !isAdmin) {
      return res.status(403).json({ message: 'Only project owner or admin can create tasks' });
    }
    
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority: priority || 'medium',
      project: projectId,
      assignedTo: assignedTo || null
    });
    
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email');
    
    res.status(201).json({ task: populatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, priority, assignedTo } = req.body;
    
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const project = await Project.findById(task.project);
    
    const isProjectOwner = project.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isAssignedUser = task.assignedTo && task.assignedTo.toString() === req.user.id;
    
    if (!isProjectOwner && !isAdmin && !isAssignedUser) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }
    
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, dueDate, priority, assignedTo },
      { new: true }
    ).populate('assignedTo', 'name email');
    
    res.status(200).json({ task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const project = await Project.findById(task.project);
    
    const isProjectOwner = project.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isProjectOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }
    
    await Task.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};