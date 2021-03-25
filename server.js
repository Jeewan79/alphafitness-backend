const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

//Routes
const userRoutes = require('./routes/user-route');
const feedbackRoutes = require('./routes/feedback-routes');

const app = express();
app.use(cors());
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

app.use('/api/auth', userRoutes);
app.use('/api/feedback', feedbackRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${5000}`));
