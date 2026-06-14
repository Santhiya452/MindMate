const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authroutes');
app.use('/api/auth', authRoutes);

const chatRoutes = require('./routes/chatroutes');
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('MindMate API is running! 🧠');
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB Connected ✅');
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000 🚀');
  });
})
.catch((err) => {
  console.log('MongoDB connection error:', err.message);
});