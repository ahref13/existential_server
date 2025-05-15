// Liminal Network Space Server
// This server introduces intentional delays and returns random HTTP status codes
// to simulate the transitional/liminal space in networks

const express = require('express');
const app = express();
const port = 3000;

// Enable CORS for client requests
app.use(express.json());

// Status code categories with descriptions for artistic context
const statusCodes = {
  // Informational responses (100–199)
  informational: [
    { code: 100, name: "Continue", message: "The initial part of the request has been received and the client should continue with the request." },
    { code: 101, name: "Switching Protocols", message: "The server is switching protocols as requested by the client." },
    { code: 102, name: "Processing", message: "The server has received and is processing the request, but no response is available yet." },
    { code: 103, name: "Early Hints", message: "Used to return some response headers before final HTTP message." }
  ],

  // Successful responses (200–299)
  success: [
    { code: 200, name: "OK", message: "The request has succeeded." },
    { code: 201, name: "Created", message: "The request has been fulfilled and a new resource has been created." },
    { code: 202, name: "Accepted", message: "The request has been accepted for processing, but the processing has not been completed." },
    { code: 203, name: "Non-Authoritative Information", message: "The returned metadata is not exactly the same as is available from the origin server." },
    { code: 204, name: "No Content", message: "The server successfully processed the request, but is not returning any content." },
    { code: 205, name: "Reset Content", message: "The server successfully processed the request, but is not returning any content. The client should reset the document view." },
    { code: 206, name: "Partial Content", message: "The server is delivering only part of the resource due to a range header sent by the client." },
    { code: 207, name: "Multi-Status", message: "The message body that follows is an XML message and can contain a number of separate response codes." },
    { code: 208, name: "Already Reported", message: "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response." },
    { code: 226, name: "IM Used", message: "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance." }
  ],

  // Redirection messages (300–399)
  redirection: [
    { code: 300, name: "Multiple Choices", message: "The request has more than one possible response." },
    { code: 301, name: "Moved Permanently", message: "The URL of the requested resource has been changed permanently." },
    { code: 302, name: "Found", message: "The URI of requested resource has been changed temporarily." },
    { code: 303, name: "See Other", message: "The server sent this response to direct the client to get the requested resource at another URI with a GET request." },
    { code: 304, name: "Not Modified", message: "This is used for caching purposes. It tells the client that the response has not been modified." },
    { code: 305, name: "Use Proxy", message: "The requested resource is only available through a proxy, the address for which is provided in the response." },
    { code: 307, name: "Temporary Redirect", message: "The server is sending this response to direct the client to get the requested resource at another URI with the same method that was used in the prior request." },
    { code: 308, name: "Permanent Redirect", message: "This means that the resource is now permanently located at another URI." }
  ],

  // Client error responses (400–499)
  clientError: [
    { code: 400, name: "Bad Request", message: "The server could not understand the request due to invalid syntax." },
    { code: 401, name: "Unauthorized", message: "Authentication is required and has failed or has not yet been provided." },
    { code: 402, name: "Payment Required", message: "Reserved for future use." },
    { code: 403, name: "Forbidden", message: "The client does not have access rights to the content." },
    { code: 404, name: "Not Found", message: "The server can not find the requested resource." },
    { code: 405, name: "Method Not Allowed", message: "The request method is known by the server but is not supported by the target resource." },
    { code: 406, name: "Not Acceptable", message: "The server cannot produce a response matching the list of acceptable values." },
    { code: 407, name: "Proxy Authentication Required", message: "Authentication with the proxy is required." },
    { code: 408, name: "Request Timeout", message: "The server timed out waiting for the request." },
    { code: 409, name: "Conflict", message: "The request could not be completed due to a conflict with the current state of the resource." },
    { code: 410, name: "Gone", message: "The requested resource is no longer available at the server and no forwarding address is known." },
    { code: 411, name: "Length Required", message: "The server refuses to accept the request without a defined Content-Length." },
    { code: 412, name: "Precondition Failed", message: "The client has indicated preconditions in its headers which the server does not meet." },
    { code: 413, name: "Payload Too Large", message: "The request entity is larger than limits defined by server." },
    { code: 414, name: "URI Too Long", message: "The URI requested by the client is longer than the server is willing to interpret." },
    { code: 415, name: "Unsupported Media Type", message: "The media format of the requested data is not supported by the server." },
    { code: 416, name: "Range Not Satisfiable", message: "The range specified by the Range header field in the request cannot be fulfilled." },
    { code: 417, name: "Expectation Failed", message: "The expectation indicated by the Expect request header field cannot be met by the server." },
    { code: 418, name: "I'm a teapot", message: "The server refuses the attempt to brew coffee with a teapot." },
    { code: 421, name: "Misdirected Request", message: "The request was directed at a server that is not able to produce a response." },
    { code: 422, name: "Unprocessable Entity", message: "The request was well-formed but was unable to be followed due to semantic errors." },
    { code: 423, name: "Locked", message: "The resource that is being accessed is locked." },
    { code: 424, name: "Failed Dependency", message: "The request failed due to failure of a previous request." },
    { code: 425, name: "Too Early", message: "The server is unwilling to risk processing a request that might be replayed." },
    { code: 426, name: "Upgrade Required", message: "The server refuses to perform the request using the current protocol." },
    { code: 428, name: "Precondition Required", message: "The origin server requires the request to be conditional." },
    { code: 429, name: "Too Many Requests", message: "The user has sent too many requests in a given amount of time." },
    { code: 431, name: "Request Header Fields Too Large", message: "The server is unwilling to process the request because its header fields are too large." },
    { code: 451, name: "Unavailable For Legal Reasons", message: "The user requested a resource that is legally unavailable." }
  ],

  // Server error responses (500–599)
  serverError: [
    { code: 500, name: "Internal Server Error", message: "The server has encountered a situation it doesn't know how to handle." },
    { code: 501, name: "Not Implemented", message: "The request method is not supported by the server and cannot be handled." },
    { code: 502, name: "Bad Gateway", message: "The server, while working as a gateway, got an invalid response from the upstream server." },
    { code: 503, name: "Service Unavailable", message: "The server is not ready to handle the request." },
    { code: 504, name: "Gateway Timeout", message: "The server is acting as a gateway and cannot get a response in time." },
    { code: 505, name: "HTTP Version Not Supported", message: "The HTTP version used in the request is not supported by the server." },
    { code: 506, name: "Variant Also Negotiates", message: "Transparent content negotiation for the request results in a circular reference." },
    { code: 507, name: "Insufficient Storage", message: "The server is unable to store the representation needed to complete the request." },
    { code: 508, name: "Loop Detected", message: "The server detected an infinite loop while processing the request." },
    { code: 510, name: "Not Extended", message: "Further extensions to the request are required for the server to fulfill it." },
    { code: 511, name: "Network Authentication Required", message: "The client needs to authenticate to gain network access." }
  ]
};

// Flatten status codes into a single array for easy random selection
const allStatusCodes = [
  ...statusCodes.informational,
  ...statusCodes.success,
  ...statusCodes.redirection,
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