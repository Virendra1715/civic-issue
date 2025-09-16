const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// All other GET requests not handled before will return the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server running at http://localhost:${port}`);
  console.log('Press Ctrl+C to stop the server');
});
