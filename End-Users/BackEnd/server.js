const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors()); // Enabling CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DB_recordOfficer'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error in database query' });
      return;
    }
    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });

});


// All enpoint for Tree Cutting Permits ------------------------------------------------------------

// TO RETRIEVE DOCUMENTS/IMAGES
app.get('/documents/treecp', (req, res) => {
  db.query('SELECT filename FROM treecp', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching documents from database' });
      return;
    }
    const filenames = results.map(result => result.filename);
    res.json(filenames);
  });
});

// TO DOWNLOAD DOCUMENTS/IMAGES
app.get('/documents/treecp/:filename', (req, res) => {
  const filename = req.params.filename;
  db.query('SELECT file FROM treecp WHERE filename = ?', [filename], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ error: 'Error fetching file from database' });
      return;
    }
    const file = result[0].file;
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(file);
  });
});
//------------------------------

// Endpoint to view a document
app.get('/view/treecp/:filename', (req, res) => {
  const filename = req.params.filename;
  db.query('SELECT file FROM treecp WHERE filename = ?', [filename], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ error: 'Error fetching file from database' });
      return;
    }
    const fileData = result[0].file;

    // Determine the content type based on the file extension
    let contentType;
    if (filename.endsWith('.pdf')) {
      contentType = 'application/pdf';
    } else if (filename.endsWith('.doc') || filename.endsWith('.docx')) {
      contentType = 'application/msword';
    } else if (filename.endsWith('.jpeg') || filename.endsWith('.jpg')) {
      contentType = 'image/jpeg';
    } else if (filename.endsWith('.png')) {
      contentType = 'image/png';
    } else {
      contentType = 'application/octet-stream'; // Default to binary data
    }

    res.setHeader('Content-Type', contentType);
    res.send(fileData);
  });
});

// All enpoint for Tree Chainsaw Registration 
// TO RETRIEVE DOCUMENTS/IMAGES
app.get('/documents/cr', (req, res) => {
  db.query('SELECT filename FROM cr', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching documents from database' });
      return;
    }
    const filenames = results.map(result => result.filename);
    res.json(filenames);
  });
});

// TO DOWNLOAD DOCUMENTS/IMAGES
app.get('/documents/cr/:filename', (req, res) => {
  const filename = req.params.filename;
  db.query('SELECT file FROM cr WHERE filename = ?', [filename], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ error: 'Error fetching file from database' });
      return;
    }
    const file = result[0].file;
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(file);
  });
});


// Endpoint to view a document
app.get('/view/cr/:filename', (req, res) => {
  const filename = req.params.filename;
  db.query('SELECT file FROM cr WHERE filename = ?', [filename], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ error: 'Error fetching file from database' });
      return;
    }
    const fileData = result[0].file;

    // Determine the content type based on the file extension
    let contentType;
    if (filename.endsWith('.pdf')) {
      contentType = 'application/pdf';
    } else if (filename.endsWith('.doc') || filename.endsWith('.docx')) {
      contentType = 'application/msword';
    } else if (filename.endsWith('.jpeg') || filename.endsWith('.jpg')) {
      contentType = 'image/jpeg';
    } else if (filename.endsWith('.png')) {
      contentType = 'image/png';
    } else {
      contentType = 'application/octet-stream'; // Default to binary data
    }

    res.setHeader('Content-Type', contentType);
    res.send(fileData);
  });
});

//All endpoint for Tree Cutting Registration
// TO RETRIEVE DOCUMENTS/IMAGES
app.get('/documents/tpr', (req, res) => {
  db.query('SELECT filename FROM tpr', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching documents from database' });
      return;
    }
    const filenames = results.map(result => result.filename);
    res.json(filenames);
  });
});

// TO DOWNLOAD DOCUMENTS/IMAGES
app.get('/documents/tpr/:filename', (req, res) => {
  const filename = req.params.filename;
  db.query('SELECT file FROM tpr WHERE filename = ?', [filename], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ error: 'Error fetching file from database' });
      return;
    }
    const file = result[0].file;
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(file);
  });
});

// Endpoint to view a document
app.get('/view/tpr/:filename', (req, res) => {
  const filename = req.params.filename;
  db.query('SELECT file FROM tpr WHERE filename = ?', [filename], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ error: 'Error fetching file from database' });
      return;
    }
    const fileData = result[0].file;

    // Determine the content type based on the file extension
    let contentType;
    if (filename.endsWith('.pdf')) {
      contentType = 'application/pdf';
    } else if (filename.endsWith('.doc') || filename.endsWith('.docx')) {
      contentType = 'application/msword';
    } else if (filename.endsWith('.jpeg') || filename.endsWith('.jpg')) {
      contentType = 'image/jpeg';
    } else if (filename.endsWith('.png')) {
      contentType = 'image/png';
    } else {
      contentType = 'application/octet-stream'; // Default to binary data
    }

    res.setHeader('Content-Type', contentType);
    res.send(fileData);
  });
});


// All enpoint for Transport Permits ------------------------------------------------------------
// TO RETRIEVE DOCUMENTS/IMAGES
app.get('/documents/tp', (req, res) => {
  db.query('SELECT filename FROM tp', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching documents from database' });
      return;
    }
    const filenames = results.map(result => result.filename);
    res.json(filenames);
  });
});

// TO DOWNLOAD DOCUMENTS/IMAGES
app.get('/documents/tp/:filename', (req, res) => {
  const filename = req.params.filename;
  db.query('SELECT file FROM tp WHERE filename = ?', [filename], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ error: 'Error fetching file from database' });
      return;
    }
    const file = result[0].file;
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(file);
  });
});


// Endpoint to view a document
app.get('/view/tp/:filename', (req, res) => {
  const filename = req.params.filename;
  db.query('SELECT file FROM tp WHERE filename = ?', [filename], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ error: 'Error fetching file from database' });
      return;
    }
    const fileData = result[0].file;

    // Determine the content type based on the file extension
    let contentType;
    if (filename.endsWith('.pdf')) {
      contentType = 'application/pdf';
    } else if (filename.endsWith('.doc') || filename.endsWith('.docx')) {
      contentType = 'application/msword';
    } else if (filename.endsWith('.jpeg') || filename.endsWith('.jpg')) {
      contentType = 'image/jpeg';
    } else if (filename.endsWith('.png')) {
      contentType = 'image/png';
    } else {
      contentType = 'application/octet-stream'; // Default to binary data
    }

    res.setHeader('Content-Type', contentType);
    res.send(fileData);
  });
});

//All endpoint for Land Title Documents
// TO RETRIEVE DOCUMENTS/IMAGES
app.get('/documents/lt', (req, res) => {
  db.query('SELECT filename FROM lt', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching documents from database' });
      return;
    }
    const filenames = results.map(result => result.filename);
    res.json(filenames);
  });
});

// TO DOWNLOAD DOCUMENTS/IMAGES
app.get('/documents/lt/:filename', (req, res) => {
  const filename = req.params.filename;
  db.query('SELECT file FROM lt WHERE filename = ?', [filename], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ error: 'Error fetching file from database' });
      return;
    }
    const file = result[0].file;
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(file);
  });
});
// Endpoint to view a document
app.get('/view/lt/:filename', (req, res) => {
  const filename = req.params.filename;
  db.query('SELECT file FROM lt WHERE filename = ?', [filename], (err, result) => {
    if (err || result.length === 0) {
      res.status(500).json({ error: 'Error fetching file from database' });
      return;
    }
    const fileData = result[0].file;

    // Determine the content type based on the file extension
    let contentType;
    if (filename.endsWith('.pdf')) {
      contentType = 'application/pdf';
    } else if (filename.endsWith('.doc') || filename.endsWith('.docx')) {
      contentType = 'application/msword';
    } else if (filename.endsWith('.jpeg') || filename.endsWith('.jpg')) {
      contentType = 'image/jpeg';
    } else if (filename.endsWith('.png')) {
      contentType = 'image/png';
    } else {
      contentType = 'application/octet-stream'; // Default to binary data
    }

    res.setHeader('Content-Type', contentType);
    res.send(fileData);
  });
});

const port = 7000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
