const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

app.use(cors()); // Enabling CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

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
// Endpoint to handle file upload
app.post('/upload/treecp', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const file = req.files.file;
  const filename = file.name;
  const fileData = file.data;

  db.query('INSERT INTO treecp (filename, file) VALUES (?, ?)', [filename, fileData], (err) => {
    if (err) {
      res.status(500).json({ error: 'Error saving file to database' });
      return;
    }
    res.json({ success: 'File uploaded successfully' });
  });
});

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
    res.json({ success: true });
  });
});
//------------------------------

// Endpoint to move a file from one table to another
app.post('/treecp/move/:sourceTable/:destinationTable', (req, res) => {
  const sourceTable = req.params.sourceTable;
  const destinationTable = req.params.destinationTable;

  // Check if both source and destination tables are provided
  if (!sourceTable || !destinationTable) {
    return res.status(400).json({ error: 'Source table and destination table are required.' });
  }

  // Extract filename from the request body
  const { filename } = req.body;

  // Check if filename is provided
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required.' });
  }

  // Move the file from source table to destination table
  db.query(`INSERT INTO ${destinationTable} (filename, file) SELECT filename, file FROM ${sourceTable} WHERE filename = ?`, [filename], (err, result) => {
    if (err) {
      console.error('Error moving file:', err);
      return res.status(500).json({ error: 'Error moving file.' });
    }

    // Delete the file from the source table after moving
    db.query(`DELETE FROM ${sourceTable} WHERE filename = ?`, [filename], (err, result) => {
      if (err) {
        console.error('Error deleting file from source table:', err);
        return res.status(500).json({ error: 'Error deleting file from source table.' });
      }

      res.json({ success: 'File moved successfully.' });
    });
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

// All enpoint for Tree Chainsaw Registration ------------------------------------------------------------
// Endpoint to handle file upload
app.post('/upload/cr', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const file = req.files.file;
  const filename = file.name;
  const fileData = file.data;

  db.query('INSERT INTO cr (filename, file) VALUES (?, ?)', [filename, fileData], (err) => {
    if (err) {
      res.status(500).json({ error: 'Error saving file to database' });
      return;
    }
    res.json({ success: 'File uploaded successfully' });
  });
});

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


// Endpoint to move a file from one table to another
app.post('/cr/move/:sourceTable/:destinationTable', (req, res) => {
  const sourceTable = req.params.sourceTable;
  const destinationTable = req.params.destinationTable;

  // Check if both source and destination tables are provided
  if (!sourceTable || !destinationTable) {
    return res.status(400).json({ error: 'Source table and destination table are required.' });
  }

  // Extract filename from the request body
  const { filename } = req.body;

  // Check if filename is provided
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required.' });
  }

  // Move the file from source table to destination table
  db.query(`INSERT INTO ${destinationTable} (filename, file) SELECT filename, file FROM ${sourceTable} WHERE filename = ?`, [filename], (err, result) => {
    if (err) {
      console.error('Error moving file:', err);
      return res.status(500).json({ error: 'Error moving file.' });
    }

    // Delete the file from the source table after moving
    db.query(`DELETE FROM ${sourceTable} WHERE filename = ?`, [filename], (err, result) => {
      if (err) {
        console.error('Error deleting file from source table:', err);
        return res.status(500).json({ error: 'Error deleting file from source table.' });
      }

      res.json({ success: 'File moved successfully.' });
    });
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
// Endpoint to handle file upload
app.post('/upload/tpr', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const file = req.files.file;
  const filename = file.name;
  const fileData = file.data;

  db.query('INSERT INTO tpr (filename, file) VALUES (?, ?)', [filename, fileData], (err) => {
    if (err) {
      res.status(500).json({ error: 'Error saving file to database' });
      return;
    }
    res.json({ success: 'File uploaded successfully' });
  });
});

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


// Endpoint to move a file from one table to another
app.post('/tpr/move/:sourceTable/:destinationTable', (req, res) => {
  const sourceTable = req.params.sourceTable;
  const destinationTable = req.params.destinationTable;

  // Check if both source and destination tables are provided
  if (!sourceTable || !destinationTable) {
    return res.status(400).json({ error: 'Source table and destination table are required.' });
  }

  // Extract filename from the request body
  const { filename } = req.body;

  // Check if filename is provided
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required.' });
  }

  // Move the file from source table to destination table
  db.query(`INSERT INTO ${destinationTable} (filename, file) SELECT filename, file FROM ${sourceTable} WHERE filename = ?`, [filename], (err, result) => {
    if (err) {
      console.error('Error moving file:', err);
      return res.status(500).json({ error: 'Error moving file.' });
    }

    // Delete the file from the source table after moving
    db.query(`DELETE FROM ${sourceTable} WHERE filename = ?`, [filename], (err, result) => {
      if (err) {
        console.error('Error deleting file from source table:', err);
        return res.status(500).json({ error: 'Error deleting file from source table.' });
      }

      res.json({ success: 'File moved successfully.' });
    });
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
// Endpoint to handle file upload
app.post('/upload/tp', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const file = req.files.file;
  const filename = file.name;
  const fileData = file.data;

  db.query('INSERT INTO tp (filename, file) VALUES (?, ?)', [filename, fileData], (err) => {
    if (err) {
      res.status(500).json({ error: 'Error saving file to database' });
      return;
    }
    res.json({ success: 'File uploaded successfully' });
  });
});

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


// Endpoint to move a file from one table to another
app.post('/tp/move/:sourceTable/:destinationTable', (req, res) => {
  const sourceTable = req.params.sourceTable;
  const destinationTable = req.params.destinationTable;

  // Check if both source and destination tables are provided
  if (!sourceTable || !destinationTable) {
    return res.status(400).json({ error: 'Source table and destination table are required.' });
  }

  // Extract filename from the request body
  const { filename } = req.body;

  // Check if filename is provided
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required.' });
  }

  // Move the file from source table to destination table
  db.query(`INSERT INTO ${destinationTable} (filename, file) SELECT filename, file FROM ${sourceTable} WHERE filename = ?`, [filename], (err, result) => {
    if (err) {
      console.error('Error moving file:', err);
      return res.status(500).json({ error: 'Error moving file.' });
    }

    // Delete the file from the source table after moving
    db.query(`DELETE FROM ${sourceTable} WHERE filename = ?`, [filename], (err, result) => {
      if (err) {
        console.error('Error deleting file from source table:', err);
        return res.status(500).json({ error: 'Error deleting file from source table.' });
      }

      res.json({ success: 'File moved successfully.' });
    });
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
// Endpoint to handle file upload
app.post('/upload/lt', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const file = req.files.file;
  const filename = file.name;
  const fileData = file.data;

  db.query('INSERT INTO lt (filename, file) VALUES (?, ?)', [filename, fileData], (err) => {
    if (err) {
      res.status(500).json({ error: 'Error saving file to database' });
      return;
    }
    res.json({ success: 'File uploaded successfully' });
  });
});

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


// Endpoint to move a file from one table to another
app.post('/lt/move/:sourceTable/:destinationTable', (req, res) => {
  const sourceTable = req.params.sourceTable;
  const destinationTable = req.params.destinationTable;

  // Check if both source and destination tables are provided
  if (!sourceTable || !destinationTable) {
    return res.status(400).json({ error: 'Source table and destination table are required.' });
  }

  // Extract filename from the request body
  const { filename } = req.body;

  // Check if filename is provided
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required.' });
  }

  // Move the file from source table to destination table
  db.query(`INSERT INTO ${destinationTable} (filename, file) SELECT filename, file FROM ${sourceTable} WHERE filename = ?`, [filename], (err, result) => {
    if (err) {
      console.error('Error moving file:', err);
      return res.status(500).json({ error: 'Error moving file.' });
    }

    // Delete the file from the source table after moving
    db.query(`DELETE FROM ${sourceTable} WHERE filename = ?`, [filename], (err, result) => {
      if (err) {
        console.error('Error deleting file from source table:', err);
        return res.status(500).json({ error: 'Error deleting file from source table.' });
      }

      res.json({ success: 'File moved successfully.' });
    });
  });
});
// Endpoint to view a document
app.get('/view/lt/:filename', (req, res) => {
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

const port = 7000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
