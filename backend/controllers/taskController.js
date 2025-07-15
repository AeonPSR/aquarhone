const Task = require('../models/Task');
const Project = require('../models/Project');

const addTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project || (project.owner.toString() !== req.userId && !project.collaborators.includes(req.userId))) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const task = await Task.create({
      ...req.body,
      project: req.params.projectId,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTasks = async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId });
  res.json(tasks);
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.status = req.body.status || task.status;
  task.assignedTo = req.body.assignedTo || task.assignedTo;

  await task.save();
  res.json(task);
};

const deleteTask = async (req, res) => {
	try {
	const task = await Task.findById(req.params.taskId);
	if (!task) return res.status(404).json({ error: 'Task not found' });

	const project = await Project.findById(task.project);
	if (!project) return res.status(404).json({ error: 'Project not found' });

	if (project.owner.toString() !== req.userId) {
		return res.status(403).json({ error: 'Only the project owner can delete tasks' });
	}

	await task.deleteOne();
	res.json({ message: 'Task deleted' });
	} catch (err) {
	res.status(500).json({ error: 'Error deleting task' });
	}
};

module.exports = {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
};
