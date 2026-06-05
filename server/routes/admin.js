const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'experiments.json');

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// POST /admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({ message: 'Login successful', token });
});

// POST /admin/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// GET /admin/verify — check if token is valid
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ authenticated: true, username: req.admin.username });
});

// GET /admin/submissions — get pending submissions
router.get('/submissions', authMiddleware, (req, res) => {
  const data = readData();
  res.json(data.submissions || []);
});

// PUT /admin/submissions/:id/approve
router.put('/submissions/:id/approve', authMiddleware, (req, res) => {
  const data = readData();
  const idx = (data.submissions || []).findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Submission not found' });

  const submission = data.submissions[idx];
  const newExperiment = {
    id: `${submission.subject.substring(0, 4)}-${Date.now()}`,
    title: submission.title,
    description: submission.description,
    subject: submission.subject,
    classLevel: submission.classLevel ? [submission.classLevel] : [9, 10],
    difficulty: submission.difficulty || 'Intermediate',
    status: 'Coming Soon',
    tags: submission.tags || [],
    image: 'beaker',
    ...req.body // allow admin overrides
  };

  data.experiments.push(newExperiment);
  data.submissions.splice(idx, 1);
  writeData(data);

  res.json({ message: 'Submission approved', experiment: newExperiment });
});

// DELETE /admin/submissions/:id — reject
router.delete('/submissions/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = (data.submissions || []).findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Submission not found' });

  data.submissions.splice(idx, 1);
  writeData(data);
  res.json({ message: 'Submission rejected' });
});

// PUT /admin/experiments/:id — edit experiment
router.put('/experiments/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.experiments.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Experiment not found' });

  data.experiments[idx] = { ...data.experiments[idx], ...req.body };
  writeData(data);
  res.json({ message: 'Experiment updated', experiment: data.experiments[idx] });
});

module.exports = router;
