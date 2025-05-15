# Liminal Network Space Server

## Important Note

This server must be running before starting the client application. The client connects to this server at `http://localhost:3000`.

## Prerequisites

* Node.js (v14.0.0 or newer)
* npm or yarn

## Installation and Setup

### 1. Clone or Download the Repository

```bash
git clone [repository-url]
# or download and extract the ZIP file
```

### 2. Install Dependencies

Navigate to the project directory and install dependencies:

```bash
cd liminal-network-server
npm install
```

### 3. Run the Server

```bash
node index.js
```

You should see the following output in your console:

```
Liminal Network Space server running at http://localhost:3000
Ready to receive requests and respond with random delays and status codes
```

## Server Behavior

The server is designed to:

1. Listen for HTTP requests on port 3000
2. Introduce a random delay between 3-15 seconds for each request
3. Respond with a random HTTP status code (100-599)

## Troubleshooting

- **Port Already in Use**: If port 3000 is already being used, you'll need to change the port in the server code and update the client accordingly
- **Connection Issues**: Ensure there are no firewall rules blocking connections to port 3000
