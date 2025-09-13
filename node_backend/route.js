const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const mongoose = require('mongoose');


const port = 5000;

// Mongoose connection remains same
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}
main()
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// Multer for temporary file upload to memory (no disk storage)
const upload = multer({ storage: multer.memoryStorage() });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/', (req, res) => res.render('home_page'));
app.get('/take_attendance', (req, res) => res.render('take_attendance'));
app.get('/live_attendance', (req, res) => res.render('live_attendance'));
app.get('/suggestions', (req, res) => res.render('suggestions'));
app.get('/daily_routine', (req, res) => res.render('daily_routine'));

// POST route to send image buffer to Python recognizer
app.post('/api/recognize', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No image uploaded');

  const py = spawn('python', ['backend/face_backend/recognize.py']);
  // Pipe the image buffer directly to Python script stdin
  py.stdin.write(req.file.buffer);
  py.stdin.end();

  let result = '';
  py.stdout.on('data', (data) => { result += data.toString(); });
  py.stdout.on('end', () => { res.json(JSON.parse(result)); });
  py.on('error', (err) => res.status(500).send('Python process error'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const FaceData = require('./models/FaceData');

app.post('/api/recognize', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No image uploaded');
  
  const py = spawn('python', ['backend/face_backend/recognize.py']);
  py.stdin.write(req.file.buffer);
  py.stdin.end();
  
  let result = '';
  py.stdout.on('data', (data) => { result += data.toString(); });
  py.stdout.on('end', async () => {
    try {
      const recognizedNames = JSON.parse(result);
      
      if (recognizedNames.length === 0) {
        return res.json({ success: false, message: "Face not recognized" });
      }

      // Update attendance to true for recognized names in DB
      await Promise.all(
        recognizedNames.map(name => 
          FaceData.findOneAndUpdate({ name }, { attendance: true })
        )
      );

      res.json({ success: true, message: "Attendance marked for: " + recognizedNames.join(', ') });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  py.on('error', (err) => {
    console.error(err);
    res.status(500).send('Python error');
  });
});

