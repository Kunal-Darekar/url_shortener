# URL Shortener

A simple URL shortener service built with Node.js, Express, and MongoDB.

## Features

- Shorten long URLs to 8-character unique IDs
- Track visit analytics for each shortened URL
- View list of recently shortened URLs
- Clean and simple web interface
- Visit history tracking

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- EJS templating
- nanoid for ID generation

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/url_shortener.git
cd url_shortener
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with:

```
MONGODB_URL=your_mongodb_connection_string
```

4. Start the server:

```bash
npm start
```

The application will be available at `http://localhost:8001`

## API Endpoints

- `POST /url` - Create a new short URL
- `GET /analytics/:shortId` - Get analytics for a specific URL
- `GET /:shortId` - Redirect to original URL
- `GET /` - Home page with URL submission form and list of recent URLs

## Project Structure

```
├── connect.js         # MongoDB connection setup
├── controllers/       # Request handlers
├── models/           # Database models
├── routes/           # Route definitions
├── views/            # EJS templates
└── index.js          # Application entry point
```

## Environment Variables

- `MONGODB_URL`: MongoDB connection string

