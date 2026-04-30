const Project = require('../models/Project');
const User = require('../models/User');

// @route   GET /api/projects
// @desc    Get all projects for logged-in user
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    // Get projects where user is owner or member
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    })
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is project owner or member
    const isOwner = project.owner._id.toString() === req.user.id;
    const isMember = project.members.some(m => m.user._id.toString() === req.user.id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this project' });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    const project = await Project.create({
      name,
      description: description || '',
      owner: req.user.id,
      members: [
        {
          user: req.user.id,
          role: 'Admin',
        }
      ]
    });

    const populatedProject = await project.populate('owner', 'name email');
    await populatedProject.populate('members.user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: populatedProject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Only owner and admins)
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    const { name, description, status } = req.body;

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;

    project = await project.save();
    await project.populate('owner', 'name email');
    await project.populate('members.user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Only owner)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/projects/:id/members
// @desc    Add member to project
// @access  Private (Only owner)
exports.addMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to add members to this project' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user already a member
    const isMember = project.members.some(m => m.user.toString() === user._id.toString());

    if (isMember) {
      return res.status(400).json({ success: false, message: 'User is already a member of this project' });
    }

    // Add member
    project.members.push({
      user: user._id,
      role: role || 'Member'
    });

    project = await project.save();
    await project.populate('owner', 'name email');
    await project.populate('members.user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   DELETE /api/projects/:id/members/:memberId
// @desc    Remove member from project
// @access  Private (Only owner)
exports.removeMember = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to remove members from this project' });
    }

    // Remove member
    project.members = project.members.filter(m => m.user.toString() !== req.params.memberId);

    project = await project.save();
    await project.populate('owner', 'name email');
    await project.populate('members.user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
