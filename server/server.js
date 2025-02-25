const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const https = require('https');

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
app.get('/ai', async (req, res) => {
 const payload = {
    messages: [
      {
        content: "whats the capital of india, give 5 spots to cover in delhi",
        role: "user",
        name: "prashant-m"
      }
    ],
    model: "llama-3-8b-instruct",
//    frequency_penalty: 0,
//    logit_bias: null,
//    logprobs: true,
//    top_logprobs: 20,
//    max_tokens: 2,
//    n: 1,
//    presence_penalty: 0,
//    response_format: {
//      type: "text"
//    },
//    stop: null,
//    stream: false,
//    stream_options: null,
//    temperature: 1,
//    top_p: 1,
//    tools: [],
//    tool_choice: "none",
//    user: "user-1234"
  };

  console.log('Request Payload:', JSON.stringify(payload, null, 2)); // Logging the payload

  try {
    const response = await axios.post('https://genai-api-dev.dell.com/v1/chat/completions',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer MjU5ZDM4NmUtMGVlNi00NzI3LWJiMjMtMmEwZDRmNjVkZmQ5'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      }
    );

    console.log('Response Data:', JSON.stringify(response.data, null, 2));

    res.json(response.data);
  } catch (error) {
          console.error('Error making POST request to AI API:', error.response ? error.response.data : error.message);
          res.status(500).json({ error: 'Error communicating with AI API' });
        }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
