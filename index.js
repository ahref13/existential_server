// Liminal Network Space Server
// This server introduces intentional delays and returns random HTTP status codes
// to simulate the transitional/liminal space in networks

import { VERSES } from "./verse-pool.js";
import express from 'express';

const app = express();
const port = 3000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Enable CORS for client requests
app.use(express.json());

function v(n) { return VERSES[n % VERSES.length]; }

// Status code categories with descriptions for artistic context
const statusCodes = {
  clientError: [
    { code: 400, name: "Bad Request", message: v(0) },
    { code: 401, name: "Unauthorized", message: v(1) },
    { code: 402, name: "Payment Required", message: v(2) },
    { code: 403, name: "Forbidden", message: v(3) },
    { code: 404, name: "Not Found", message: v(4) },
    { code: 405, name: "Method Not Allowed", message: v(5) },
    { code: 406, name: "Not Acceptable", message: v(6) },
    { code: 407, name: "Proxy Authentication Required", message: v(7) },
    { code: 408, name: "Request Timeout", message: v(8) },
    { code: 409, name: "Conflict", message: v(9) },
    { code: 410, name: "Gone", message: v(10) },
    { code: 411, name: "Length Required", message: v(11) },
    { code: 412, name: "Precondition Failed", message: v(12) },
    { code: 413, name: "Payload Too Large", message: v(13) },
    { code: 414, name: "URI Too Long", message: v(14) },
    { code: 415, name: "Unsupported Media Type", message: v(15) },
    { code: 416, name: "Range Not Satisfiable", message: v(16) },
    { code: 417, name: "Expectation Failed", message: v(17) },
    { code: 418, name: "I'm a teapot", message: v(18) },
    { code: 421, name: "Misdirected Request", message: v(19) },
    { code: 422, name: "Unprocessable Entity", message: v(20) },
    { code: 423, name: "Locked", message: v(21) },
    { code: 424, name: "Failed Dependency", message: v(22) },
    { code: 425, name: "Too Early", message: v(23) },
    { code: 426, name: "Upgrade Required", message: v(24) },
    { code: 428, name: "Precondition Required", message: v(25) },
    { code: 429, name: "Too Many Requests", message: v(26) },
    { code: 431, name: "Request Header Fields Too Large", message: v(27) },
    { code: 451, name: "Unavailable For Legal Reasons", message: v(28) },
    { code: 452, name: "Signal Echo", message: v(29) },
    { code: 453, name: "Request Loop", message: v(30) }
  ],

  // Server error responses (500–599)
    serverError: [
      { code: 501, name: "Not Implemented", message: v(31) },
      { code: 502, name: "Bad Gateway", message: v(32) },
      { code: 503, name: "Service Unavailable", message: v(33) },
      { code: 504, name: "Gateway Timeout", message: v(34) },
      { code: 505, name: "HTTP Version Not Supported", message: v(35) },
      { code: 506, name: "Variant Also Negotiates", message: v(36) }, // wraps to 0
      { code: 507, name: "Insufficient Storage", message: v(37) },
      { code: 508, name: "Loop Detected", message: v(38) },
      { code: 510, name: "Not Extended", message: v(39) },
      { code: 511, name: "Network Authentication Required", message: v(40) },
      { code: 512, name: "Cache Overflow", message: v(41) },
      { code: 513, name: "Socket Timeout", message: v(42) }
    ]
};

// Flatten status codes into a single array for easy random selection
const allStatusCodes = [
  ...statusCodes.clientError,
  ...statusCodes.serverError
];

// Random delay generator function
const generateRandomDelay = () => {
  // Generate a random delay between 3 and 15 seconds
  return Math.floor(Math.random() * (30000 - 10000 + 1)) + 3000;
};

// Random status code selector
const getRandomStatusCode = () => {
  const randomIndex = Math.floor(Math.random() * allStatusCodes.length);
  return allStatusCodes[randomIndex];
};

// Main endpoint for the liminal experience
// Using explicit paths instead of wildcard to avoid path-to-regexp issues
app.use((req, res) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`);

  // Generate random delay
  const delay = generateRandomDelay();
  console.log(`Introducing a delay of ${delay/1000} seconds...`);

  // Execute after delay
  setTimeout(() => {
    // Pick a random status code
    const statusResponse = getRandomStatusCode();
    console.log(`Responding with status code ${statusResponse.code}: ${statusResponse.name}`);

    // Send response with the random status code
    res.status(statusResponse.code).json({
      status: statusResponse.code,
      name: statusResponse.name,
      message: statusResponse.message,
      timestamp: new Date().toISOString(),
      request: {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body
      }
    });
  }, delay);
});

// Start the server
app.listen(port, () => {
  console.log(`Liminal Network Space server running at http://localhost:${port}`);
  console.log(`Ready to receive requests and respond with random delays and status codes`);
});