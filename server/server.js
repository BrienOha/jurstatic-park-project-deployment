require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dinoRoutes = require('./routes/dinoRoutes');
const { seedDatabase } = require('./controllers/dinoController'); 

const app = express();

// 1. UPDATE CORS: Allow connection from anywhere (for now) to prevent blocking
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB (This works for both Local and Atlas)
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ InGen Mainframe Connected');
        // Auto-seed logic
        const Dinosaur = require('./models/Dinosaur');
        const count = await Dinosaur.countDocuments();
        if(count === 0) await seedDatabase(null, null);
    })
    .catch(err => console.error('❌ Connection Failed:', err));

app.use('/api/dinosaurs', dinoRoutes);

// 2. CONDITIONAL LISTEN: Only run this part if we are NOT on Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running locally on port ${PORT}`));
}

// 3. EXPORT APP: Required for Vercel Serverless
module.exports = app;