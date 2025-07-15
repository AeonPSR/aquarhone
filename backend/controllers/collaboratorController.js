const Project = require('../models/Project');
const User = require('../models/User');

const addCollaborator = async (req, res) => {
	const { email } = req.body;
	const project = await Project.findById(req.params.id);

	if (!project) return res.status(404).json({ error: 'Project not found' });
	if (project.owner.toString() !== req.userId)
		return res.status(403).json({ error: 'Only the owner can add collaborators' });

	const user = await User.findOne({ email });
	if (!user) return res.status(404).json({ error: 'User not found' });

	if (
		project.collaborators.includes(user._id) ||
		project.owner.toString() === user._id.toString()
	) {
		return res.status(400).json({ error: 'User already part of the project' });
	}

	project.collaborators.push(user._id);
	await project.save();

	res.json({ message: 'Collaborator added', collaborator: user.email });
};

const removeCollaborator = async (req, res) => {
	const project = await Project.findById(req.params.id);

	if (!project) return res.status(404).json({ error: 'Project not found' });
	if (project.owner.toString() !== req.userId)
	return res.status(403).json({ error: 'Only the owner can remove collaborators' });

	const userId = req.params.userId;

	if (!project.collaborators.includes(userId)) {
	return res.status(400).json({ error: 'User is not a collaborator' });
	}

	project.collaborators = project.collaborators.filter(
	(id) => id.toString() !== userId
	);
	await project.save();

	res.json({ message: 'Collaborator removed' });
};

module.exports = {
	addCollaborator,
	removeCollaborator,
};
