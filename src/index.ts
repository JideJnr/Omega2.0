import express, { Request, Response } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 3001;
const API_GATEWAY_SECRET = process.env.API_GATEWAY_SECRET || 'default-secret';

// State management
let automationActive = false;
let automationInterval: NodeJS.Timeout | null = null;
const logClients = new Set<WebSocket>();

// Create combined HTTP/WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
  logClients.add(ws);
  console.log(`New WebSocket client connected. Total clients: ${logClients.size}`);
  
  ws.on('close', () => {
    logClients.delete(ws);
    console.log(`WebSocket client disconnected. Remaining clients: ${logClients.size}`);
    
    // Stop automation if no clients remain
    if (logClients.size === 0 && automationActive) {
      automationActive = false;
      if (automationInterval) {
        clearInterval(automationInterval);
        automationInterval = null;
      }
      console.log('Automation stopped due to no active clients');
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// HTTP Command Endpoints
app.post('/start', (req: Request, res: Response) => {
  // Authorization check
  if (req.headers['x-api-key'] !== API_GATEWAY_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Start automation if not already running
  if (!automationActive) {
    automationActive = true;
    startAutomation();
    console.log('Bot started');
    return res.status(202).json({ status: 'started' });
  }
  
  res.status(200).json({ status: 'already-running' });
});

app.post('/stop', (req: Request, res: Response) => {
  // Authorization check
  if (req.headers['x-api-key'] !== API_GATEWAY_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Stop automation if running
  if (automationActive) {
    automationActive = false;
    if (automationInterval) {
      clearInterval(automationInterval);
      automationInterval = null;
    }
    console.log('Bot stopped');
    return res.status(202).json({ status: 'stopping' });
  }
  
  res.status(200).json({ status: 'already-stopped' });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok',
    automationActive,
    connectedClients: logClients.size
  });
});

// Automation Core
function startAutomation() {
  if (automationInterval) return;

  automationInterval = setInterval(() => {
    // Only generate logs if clients are connected
    if (logClients.size === 0) return;

    const log = `[AUTOMATION] ${new Date().toISOString()}`;
    const errorLog = `[ERROR] Simulated error at ${new Date().toISOString()}`;
    
    // Send logs to all connected clients
    logClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        // Simulate occasional errors (1 in 10 chance)
        if (Math.random() > 0.9) {
          client.send(errorLog);
        } else {
          client.send(log);
        }
      }
    });
  }, 1000);
}

// Start combined server
server.listen(PORT, () => {
  console.log(`Bot Service running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received - shutting down gracefully');
  
  // Clear any running intervals
  if (automationInterval) {
    clearInterval(automationInterval);
  }
  
  // Close all WebSocket connections
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.close(1001, 'Server shutting down');
    }
  });
  
  // Close the server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});