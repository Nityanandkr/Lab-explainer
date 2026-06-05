require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const adminRoutes = require('./routes/admin');
const experimentRoutes = require('./routes/experiments');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/admin', adminRoutes);
app.use('/experiments', experimentRoutes);
app.use('/api', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'LabVerse API is running 🧪', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🧪 LabVerse API server running on http://localhost:${PORT}`);
});
