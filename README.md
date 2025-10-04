# URL Shortener

A powerful and efficient URL shortening service that transforms long, unwieldy URLs into concise, shareable links.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

This URL Shortener is a web application designed to create shortened URLs that redirect to original longer URLs. It provides an elegant solution for sharing links on platforms with character limitations, tracking click analytics, and making URLs more manageable.

## Features

### Core Functionality

- **URL Shortening**: Convert long URLs into short, memorable links
- **Custom Aliases**: Create personalized short links with custom aliases
- **QR Code Generation**: Generate QR codes for shortened URLs
- **Link Expiration**: Set expiration dates for temporary links
- **Click Analytics**: Track visitor statistics including:
  - Total clicks
  - Referrer sources
  - Geographic location
  - Device information
  - Time-based analytics

### User Management

- **User Accounts**: Register and manage your shortened URLs
- **Dashboard**: Visual representation of link performance
- **Bulk URL Creation**: Create multiple shortened URLs at once
- **Link History**: Access and manage previously created links

## Tech Stack

### Frontend

- HTML5, CSS3, JavaScript
- Responsive design for mobile and desktop
- Interactive charts for analytics visualization

### Backend

- RESTful API architecture
- Database for storing URL mappings and analytics
- Authentication and authorization system
- Rate limiting to prevent abuse

### Security Features

- HTTPS encryption
- Protection against spam and malicious URLs
- Rate limiting for API requests
- Data validation and sanitization

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- MongoDB (v4.0 or higher)

### Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration settings.

4. Start the application:

```bash
npm start
```

5. Access the application at `http://localhost:3000`

## Usage

### Creating a Shortened URL

1. Navigate to the homepage
2. Enter the long URL in the input field
3. (Optional) Customize the alias or set an expiration date
4. Click "Shorten" to generate your shortened URL
5. Copy and share your new shortened link

### Managing URLs (Registered Users)

1. Log in to your account
2. Access the dashboard to view all your shortened URLs
3. View analytics for each link
4. Edit or delete existing links
5. Export analytics data in various formats

### API Usage

Basic API request to create a shortened URL:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"longUrl":"https://example.com/very/long/url/that/needs/shortening"}' http://yourdomain.com/api/shorten
```

## API Documentation

### Endpoints

| Endpoint             | Method | Description                    | Authentication Required |
| -------------------- | ------ | ------------------------------ | ----------------------- |
| `/api/shorten`       | POST   | Create a new shortened URL     | No                      |
| `/api/urls`          | GET    | Get all URLs for a user        | Yes                     |
| `/api/urls/:id`      | GET    | Get details for a specific URL | Yes                     |
| `/api/urls/:id`      | DELETE | Delete a shortened URL         | Yes                     |
| `/api/analytics/:id` | GET    | Get analytics for a URL        | Yes                     |

For detailed API documentation, see the [API Documentation](docs/api.md) file.

## Project Structure

```
url-shortener/
├── client/                 # Frontend code
│   ├── public/             # Static assets
│   └── src/                # React components and styles
├── server/                 # Backend code
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── utils/              # Helper functions
├── config/                 # Configuration files
├── tests/                  # Test suites
└── docs/                   # Documentation
```

## Contributing

We welcome contributions to improve the URL Shortener! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- [MongoDB](https://www.mongodb.com/) - Database
- [Express.js](https://expressjs.com/) - Web framework
- [React](https://reactjs.org/) - Frontend library
- [Node.js](https://nodejs.org/) - JavaScript runtime

---

Built with ❤️ by Kunal Darekar

```

```
