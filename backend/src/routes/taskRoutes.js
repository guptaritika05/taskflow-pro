import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, getAllTasks } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getAllTasks);
router.get('/project/:projectId/tasks', getTasks);
router.post('/project/:projectId/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;