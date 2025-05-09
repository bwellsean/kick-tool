# Toxicicty Tracker Technical Manual

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
   - [Server](#server)
   - [API Client](#api-client)
   - [Message Store](#message-store)
   - [Toxicity Analysis](#toxicity-analysis)
4. [Front-End Implementation](#front-end-implementation)
5. [Webhook Integration](#webhook-integration)
6. [Docker Deployment](#docker-deployment)
7. [Configuration](#configuration)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)

## Introduction

Toxicicty Tracker is a web application designed to monitor and analyze chat messages from Kick.com livestreams. It provides real-time tracking of chat messages, performs toxicity analysis using Google's Perspective API, and presents statistics on chat toxicity levels. The application is built using a Node.js backend with Express.js and a vanilla JavaScript frontend.

Key features include:
- Real-time chat message retrieval from Kick.com channels
- Toxicity analysis of chat messages
- User-specific toxicity metrics and statistics
- WebHook-based integration with Kick's chat events
- Docker containerization for easy deployment

## System Architecture

The Toxicicty Tracker application follows a client-server architecture:

### Backend:
- **Node.js server** (Express.js) - Handles API requests, webhook events, and serves the web interface
- **In-memory message store** - Manages chat messages and toxicity data
- **Google Perspective API integration** - Provides toxicity analysis for messages
- **Kick.com API integration** - Interfaces with Kick.com for channel data and subscriptions

### Frontend:
- **HTML/CSS/JavaScript** - Simple, responsive web interface
- **Polling mechanism** - Retrieves messages and statistics at regular intervals

### Data Flow:
1. User enters a Kick channel name in the web interface
2. Application fetches channel details from Kick API
3. User subscribes to chat events for the channel
4. Server receives webhook events from Kick when new messages are posted
5. Messages are stored and analyzed for toxicity
6. Web interface polls for new messages and displays them with toxicity indicators

## Core Components

### Server

**File: `server.js`**

The server component is the central hub of the application, implemented using Express.js. It provides:

- An HTTP server for the web interface and API endpoints
- Webhook handlers for Kick chat events
- Message storage and retrieval
- Integration with the Perspective API for toxicity analysis

Key routes include:
- `GET /` - Serves the main web interface
- `POST /webhook` - Receives chat events from Kick.com
- `GET /api/messages` - Retrieves stored messages with optional broadcaster filtering
- `GET /api/toxicity-stats` - Provides toxicity statistics for messages
- `GET /test-webhook` - Endpoint for testing webhook connectivity
- `POST /test-message` - Allows manual creation of test messages

The server initializes with environment variables loaded from the .env file, including API keys and configuration settings. It logs detailed information about requests and responses to aid in debugging.

### API Client

**Files: `app.js`, `channel-finder.js`**

The API client components handle authentication and communication with the Kick.com API:

**app.js** provides core functionality:
- `getAccessToken()` - Obtains OAuth access tokens from Kick's authentication service
- `makeApiRequest()` - Generic function for making authenticated API calls to Kick endpoints

**channel-finder.js** contains channel-specific functionality:
- `findChannelByName()` - Searches for a Kick channel using multiple API methods
  - Method 1: Using the slug parameter directly
  - Method 2: Using the slug[] parameter format
  - Method 3: Using direct path parameter

The API client automatically handles authentication token generation and renewal, error handling, and response processing.

### Message Store

**File: `message-store.js`**

The message store provides in-memory storage and analytics for chat messages:

Key functions:
- `addMessage(message)` - Adds a new chat message to the store
- `updateMessageToxicity(messageId, toxicityScores)` - Updates toxicity scores for a specific message
- `getMessages(broadcasterId)` - Retrieves messages, optionally filtered by broadcaster
- `getToxicityStats(broadcasterId)` - Calculates toxicity statistics from stored messages, including:
  - Average toxicity across all messages
  - Most toxic message
  - Most toxic user with their statistics
  - Most positive user with their statistics
- `clearMessages()` - Removes all stored messages
- `addTestMessage(broadcasterId)` - Adds a test message for debugging

The store manages message capacity by removing older messages when `MAX_MESSAGES` limit is reached.

### Toxicity Analysis

**File: `perspective-client.js`**

This component integrates with Google's Perspective API to analyze the toxicity of chat messages:

Key functions:
- `getClient()` - Initializes and caches the Perspective API client
- `analyzeToxicity(text)` - Analyzes a text string for various toxicity attributes
- `batchAnalyzeToxicity(messages, maxBatchSize)` - Processes multiple messages in batches to avoid rate limiting

The toxicity analysis accounts for:
- General toxicity (rudeness, disrespect)
- Insults
- Profanity

Special handling is provided for bracketed messages (e.g., `[message]`), which are automatically assigned low toxicity scores.

## Front-End Implementation

**Files: `index.html`, `styles.css`**

The front-end consists of a responsive web interface implemented with HTML, CSS, and vanilla JavaScript:

**Key UI Components:**
- Channel search and subscription controls
- Channel information display
- Real-time chat message feed
- Toxicity statistics dashboard with:
  - Average toxicity meter
  - Most toxic user profile
  - Most positive user profile

**Main JavaScript Functions:**
- `findChannel()` - Searches for a channel by name
- `subscribeToChat()` - Creates a webhook subscription
- `startPollingMessages()` - Begins polling for new messages
- `fetchMessages()` - Retrieves messages from the server
- `fetchToxicityStats()` - Gets toxicity statistics
- `updateToxicityDisplay()` - Updates UI with toxicity information
- `addMessageToChat()` - Renders chat messages with toxicity indicators

The interface updates in real-time as new messages arrive and toxicity scores are calculated.

## Webhook Integration

**Files: `chat-subscriber.js`, `webhook-server.js`, `api/webhook.js`**

The application uses webhook integration to receive real-time updates from Kick:

**chat-subscriber.js** handles webhook subscriptions:
- `subscribeToChatEvents(broadcasterId)` - Creates a subscription to a channel's chat events

**webhook-server.js** provides a standalone webhook receiver:
- Verifies the authenticity of incoming webhooks using Kick's public key
- Processes and formats incoming chat messages

**api/webhook.js** provides serverless function webhook handling:
- `handler(req, res)` - Processes webhook events in a serverless environment
- `verifySignature()` - Validates webhook signatures

When a chat message is received via webhook, it's:
1. Validated for authenticity
2. Formatted and stored
3. Analyzed for toxicity (asynchronously)
4. Made available to the front-end

## Docker Deployment

**Files: `Dockerfile`, `compose.yaml`**

The application includes Docker configuration for containerized deployment:

**Dockerfile** defines a multi-stage build:
1. Uses Node.js 22.13.1 slim image as the base
2. Installs production dependencies
3. Copies application source code
4. Creates and uses a non-root user for security
5. Sets production environment variables
6. Exposes port 3000
7. Starts the server

**compose.yaml** orchestrates the containerized application:
- Defines the `js-app` service based on the Dockerfile
- Maps port 3000 from the container to the host
- Configures container restart policy
- Sets up environment variables (via .env file)

The Docker setup provides a consistent environment for production deployment.

## Configuration

**File: `.env`**

The application is configured through environment variables in the `.env` file:

```
PORT=3000                   # Server port
NODE_ENV=development        # Environment mode
PERSPECTIVE_API_KEY=...     # Google Perspective API key
KICK_API_KEY=...            # Kick API client ID
KICK_API_SECRET=...         # Kick API client secret
EXTERNAL_URL=...            # External URL for webhook callbacks
MAX_MESSAGES=500            # Maximum messages to store in memory
```

For local development, these variables can be set directly in the `.env` file. For production, they should be configured in the hosting environment.

## API Reference

### Kick API

The application integrates with multiple Kick API endpoints:

**Authentication:**
- `POST https://id.kick.com/oauth/token` - Obtains OAuth access tokens

**Channel Information:**
- `GET /public/v1/channels` - Gets channel information by slug or broadcaster ID
- `GET /public/v1/channels/{channel_name}` - Gets channel by direct path

**Event Subscriptions:**
- `GET /public/v1/events/subscriptions` - Lists current subscriptions
- `POST /public/v1/events/subscriptions` - Creates new event subscriptions
- `DELETE /public/v1/events/subscriptions` - Removes subscriptions

**Other Endpoints:**
- `GET /public/v1/public-key` - Retrieves Kick's public key for webhook verification

### Internal API

The application exposes several internal API endpoints:

**Message Endpoints:**
- `GET /api/messages` - Retrieves chat messages with optional broadcaster filtering
- `GET /api/toxicity-stats` - Gets toxicity statistics for messages

**Test Endpoints:**
- `GET /test-webhook` - Tests webhook connectivity
- `POST /test-message` - Creates test messages

**WebHook Endpoint:**
- `POST /webhook` - Receives webhook events from Kick.com

## Troubleshooting

Common issues and solutions:

**Webhook Not Receiving Messages:**
- Verify the `EXTERNAL_URL` is publicly accessible
- Check the webhook subscription was created successfully
- Ensure the Kick API keys are valid
- Review server logs for webhook verification failures

**Toxicity Analysis Not Working:**
- Verify the `PERSPECTIVE_API_KEY` is valid
- Check the server logs for API errors
- Make sure the message content isn't empty or bracketed

**Docker Deployment Issues:**
- Check the Docker logs for application errors
- Verify environment variables are properly set
- Ensure port 3000 is not already in use

**API Authentication Failures:**
- Verify Kick API credentials are correct
- Check for API rate limiting
- Ensure the access token hasn't expired