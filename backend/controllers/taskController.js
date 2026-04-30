const Task = require('../models/Task');
const Project = require('../models/Project');

// @route   GET /api/tasks/project/:projectId
// @desc    Get all tasks for a project
// @access  Private
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, sortBy } = req.query;

    // Verify user is member of project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(m => m.user.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to view tasks in this project' });
    }

    // Build filter
    let filter = { project: projectId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Build sort
    let sortOption = { createdAt: -1 };
    if (sortBy === 'dueDate') sortOption = { dueDate: 1 };
    if (sortBy === 'priority') sortOption = { priority: -1 };

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name email');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check authorization
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(m => m.user.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignee, priority, dueDate } = req.body;

    if (!title || !project) {
      return res.status(400).json({ success: false, message: 'Title and project are required' });
    }

    // Verify user is member of project
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const isOwner = projectDoc.owner.toString() === req.user.id;
    const isMember = projectDoc.members.some(m => m.user.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to create task in this project' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      project,
      assignee: assignee || null,
      createdBy: req.user.id,
      priority: priority || 'Medium',
      dueDate: dueDate || null,
    });

    const populatedTask = await task
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: populatedTask,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check authorization
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user.id;
    const isMember = project.members.some(m => m.user.toString() === req.user.id);
    const isCreator = task.createdBy.toString() === req.user.id;

    if (!isOwner && !isMember && !isCreator) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    const { title, description, status, priority, dueDate, assignee } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignee !== undefined) task.assignee = assignee;

    task = await task.save();
    await task.populate('assignee', 'name email');
    await task.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Creator or project owner)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check authorization
    const project = await Project.findById(task.project);
    const isOwner = project.owner.toString() === req.user.id;
    const isCreator = task.createdBy.toString() === req.user.id;

    if (!isOwner && !isCreator) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/tasks/:id/comments
// @desc    Add comment to task
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.comments.push({
      user: req.user.id,
      text,
    });

    task = await task.save();
    await task.populate('comments.user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/tasks/dashboard/overview
// @desc    Get dashboard overview
// @access  Private
exports.getDashboardOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all projects for user
    const projects = await Project.find({
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    });

    const projectIds = projects.map(p => p._id);

    // Get task statistics
    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
    const completedTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'Done' });
    const inProgressTasks = await Task.countDocuments({ project: { $in: projectIds }, status: 'In Progress' });
    const overdueTasks = await Task.countDocuments({ project: { $in: projectIds }, isOverdue: true, status: { $ne: 'Done' } });

    // Get assigned tasks
    const assignedTasks = await Task.find({ assignee: userId })
      .populate('project', 'name')
      .limit(5)
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        assignedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
