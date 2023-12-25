import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { dirname} from "path";
import { fileURLToPath } from "url";
import detectText from './ocr_script.js';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 5000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());

// Connect to MongoDB (Make sure you have MongoDB running)
mongoose.connect('mongodb+srv://20ucs227:fG0RsFr96kD5Y6FK@cluster0.mbmelfw.mongodb.net/?retryWrites=true&w=majority');

// Create a schema for storing image metadata
const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
});

const Image = mongoose.model('Image', imageSchema);

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  },
});

// Initialize multer with storage options
const upload = multer({ storage: storage });

app.get('/public/', (req, res) => {
    res.sendFile(__dirname+"/public/index.html");
});



// Serve uploaded images
// app.use('/uploads', express.static('uploads'));

// API endpoint for image upload
app.all('/submit', upload.single('file'), async(req, res) => {
  console.log("dfdf");
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    
    
    const image = new Image({
      filename: req.file.filename,
      path: req.file.path,
    });

    await image.save();
    const img = req.file.filename;

    const output = 'output.txt';
    const jfile = await detectText(__dirname+'/uploads/'+img, output);

    await res.json(jfile);

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});
