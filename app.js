// Import Express.js
const express = require('express');

// Create an Express app
//EAAPPqQKCdogBSe2Khqfr7gZCMZColKk1pZCCYydG1xTF3utTFFaFzlJsM2elvOx0ItZAs3ZAwnqBEDiudemJYlxgZCiMu19liA6ZAJ2RdyFWhltA6egP9NMGr4exo0lkASJ53vIhr3VheZBHUaZAw5kAqvzluXIWjyLiuylYtjuBHtLflgc2m9S8vUCOBZB9rcFwZDZD
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
