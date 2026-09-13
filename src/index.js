require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/mongodb');
const mainRoutes = require('./routes/routes');
const config = require('./config/config');

const app = express();
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', mainRoutes);

// 404 Handler
app.use((req, res) => res.status(404).json({ success: false, message: 'API Route not found' }));

app.listen(config.port, () => console.log(`Server running on port ${config.port}`));