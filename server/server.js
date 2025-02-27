const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const https = require('https');
const jira = require('./jira.json');
var cors = require('cors')

const app = express();
const port = 3000;

app.use(cors())

const PROMPT_CONTENT = `
${JSON.stringify(jira.stories)}

Given the above list of stories, assign these stories into sprints in a most optimised capacity utilization and according to the dependencies. Where dependent story should be completed in previous sprint.

Sprint capacity is given below in the object format, where key is sprint and value is capacity, here capacity represents number of maximum story points accommodate which should be less than or equal to the capacity of the sprint

Sprint capacity - {"sprint 1": 5, "sprint 2": 5, "sprint 3": 5, "sprint 4": 5}

All the below conditions should be fulfilled while assigning stories into the sprint
1. Assuming in the sprint1, pick up the stories which has no dependencies but sum of all the story points in the sprint should be less than or equal to the sprint capacity
2. stories can only be picked in the sprint if its dependent story completed in previous sprints
3. Sum of story points attached in a sprint should not be exceed from the total capacity allocated to sprint

Generate a story plan for the sprint in object format where sprint name are the keys and calculated stories attached to sprint as an array of story object (containing all story fields).

Send only JSON response without markdown formatting of any code, this response should contain object where sprint name is keys and array of stories as value, 

Please provide the same JSON response without any supporting text or explanation.
`

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
        content: PROMPT_CONTENT,
        role: "user",
        name: "prashant-m"
      }
    ],
    model: "phi-3-5-moe-instruct",
    //    frequency_penalty: 0,
    //    logit_bias: null,
    //    logprobs: true,
    //    top_logprobs: 20,
    //    max_tokens: 2,
    //    n: 1,
    //    presence_penalty: 0,
    // response_format: {
    //   type: "json_schema"
    // },
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

    //console.log('Response Data:', JSON.stringify(response.data, null, 2));

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
