const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Define the path to the jira.json file
const jiraFilePath = path.join(__dirname, 'jira.json');

// Route to handle GET requests for /jira/:id
app.get('/jira/:id', (req, res) => {
  const { id } = req.params;

  // Read the jira.json file
  fs.readFile(jiraFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading Jira data' });
    }

    // Parse the JSON data
    const jiraData = JSON.parse(data);

    // Return the data based on the id in the request
    return res.json(jiraData);
  });
});

// post call to AI
app.get('/ai', (req, res) => {
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
