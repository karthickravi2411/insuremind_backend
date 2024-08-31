const express = require('express');
const multer = require('multer');
const { Worker } = require('worker_threads');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and XLSX files are allowed.'));
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter 
});

router.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

  const worker = new Worker(path.join(__dirname, '../helper/', 'uploadWorker.js'), {
    workerData: { filePath }
  });

  worker.on('message', (message) => {
    res.send(message);
  });

  worker.on('error', (error) => {
    res.status(500).send(`Error: ${error.message}`);
  });
});

module.exports = router;
