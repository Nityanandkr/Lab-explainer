const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_PATH = path.join(__dirname, '..', 'data', 'experiments.json');

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// GET /experiments — list experiments (optional ?subject=chemistry&classLevel=10&status=Live)
router.get('/', (req, res) => {
  const data = readData();
  let experiments = data.experiments;

  if (req.query.subject) {
    experiments = experiments.filter(e => e.subject === req.query.subject);
  }
  if (req.query.classLevel) {
    const cl = parseInt(req.query.classLevel);
    experiments = experiments.filter(e => e.classLevel.includes(cl));
  }
  if (req.query.status) {
    experiments = experiments.filter(e => e.status === req.query.status);
  }
  if (req.query.difficulty) {
    experiments = experiments.filter(e => e.difficulty === req.query.difficulty);
  }

  res.json(experiments);
});

// POST /experiments/request — student submits experiment request
router.post('/request', (req, res) => {
  const { title, description, subject, classLevel, studentName, studentEmail, difficulty, tags } = req.body;

  if (!title || !description || !subject) {
    return res.status(400).json({ error: 'Title, description, and subject are required.' });
  }

  const data = readData();
  const submission = {
    id: uuidv4(),
    title,
    description,
    subject,
    classLevel: classLevel || 10,
    difficulty: difficulty || 'Intermediate',
    studentName: studentName || 'Anonymous',
    studentEmail: studentEmail || '',
    tags: tags || [],
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };

  if (!data.submissions) data.submissions = [];
  data.submissions.push(submission);
  writeData(data);

  res.status(201).json({ message: 'Experiment request submitted successfully!', submission });
});

module.exports = router;
