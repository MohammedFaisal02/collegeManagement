const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB Connection Error: ', err);
    process.exit(1); // Exit the app if DB connection fails
  });

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes'); // Ensure this exists or remove if not ready
const subjectRoutes = require('./routes/subjectRoutes'); 
const assessmentRoutes = require('./routes/assessmentRoutes'); 
// Health Check Endpoint
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use routes
app.use('/api/students', studentRoutes); // Corrected to match convention
app.use('/api/faculty', facultyRoutes); // Update or comment out if not implemented
app.use('/api/subjects', subjectRoutes); // Update or comment out if not implemented
app.use('/api', assessmentRoutes); // Update or comment out if not implemented

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.post('/api/students/register', async (req, res) => {
  try {
    console.log(req.body); // Log the incoming data
    // Your database logic here
    res.status(201).send({ message: 'Student registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


app.post('/api/students/login', async (req, res) => {
  const { rollNumber, dob } = req.body;

  try {
      // Find the student in the database
      const student = await Student.findOne({ rollNumber, dob });

      if (student) {
          res.status(200).json({ success: true, student });
      } else {
          res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
  } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

