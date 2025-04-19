const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const promptRoutes = require('./routes/promptRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

dotenv.config();

// Middleware
app.use(cors({
  origin: "https://promptly-sigma.vercel.app",
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB: ', err));



// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/auth/prompts', promptRoutes);
app.use('/api/user', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/events', eventRoutes);



// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


