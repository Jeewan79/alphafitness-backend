const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

//Routes
const userRoutes = require('./routes/user-route');
const feedbackRoutes = require('./routes/feedback-routes');
const progressRoutes = require('./routes/progress-route');
const instructorRoutes = require('./routes/instructor-route');

const app = express();
app.use(cors());
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

app.use('/api/auth', userRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/instructor', instructorRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${5000}`));
