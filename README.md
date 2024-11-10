# AREA (Action-REAction) Platform

## Overview

AREA is an automation platform similar to IFTTT or Zapier, allowing users to create automated workflows by connecting various services through actions and reactions. The platform consists of three main components:

1. **Application Server**: Core backend implementing business logic and REST API
2. **Web Client**: Browser-based user interface
3. **Mobile Client**: Native mobile application

## 🚀 Features

- User authentication (OAuth2 support)
- Service integration (Google, Microsoft, GitHub, Discord, etc.)
- Custom automation workflows (AREA)
- Real-time trigger system
- Cross-platform support (Web + Mobile)
- Responsive design
- Docker-based deployment

## 🛠️ Tech Stack

### Backend
- Node.js with Express
- PostgreSQL
- TypeScript
- REST API

### Web Frontend
- Next.js
- Material-UI
- Redux
- TypeScript

### Mobile App
- Flutter
- Material Design

### Documentation
- Docusaurus

### DevOps
- Docker
- Docker Compose
- CI/CD Pipeline

## 📋 Prerequisites

- Node.js ≥ 18
- Docker and Docker Compose
- Flutter SDK
- PostgreSQL

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd area
```

2. Install dependencies for each component:

```bash
# Backend
cd server
npm install

# Web Frontend
cd ../web
npm install

# Documentation
cd ../docs-area
npm install
```

3. Set up environment variables:
Create `.env` files in both server and web directories using the provided templates.

## 🚀 Development

### Backend Server
```bash
cd server
npm run dev
```

### Web Client
```bash
cd web
npm run dev
```

### Mobile Client
```bash
cd mobile
flutter pub get
flutter run
```

### Documentation
```bash
cd docs-area
npm run start
```

## 🐳 Docker Deployment

The project uses Docker Compose for deployment. Main services:
- `server`: Application server (Port 8081)
- `client_web`: Web client (Port 8082)
- `client_mobile`: Mobile client builder

To start all services:
```bash
docker-compose up --build
```

## 📱 Mobile Build

To build the Android APK:
```bash
cd mobile
make build-apk
```

The APK will be available at `http://localhost:8082/client.apk` when running in Docker.

## 📖 API Documentation

The server exposes a REST API with the following key endpoints:

### Status Check
```
GET /api/status
```

### Service Information
```
GET /api/about.json
```
Returns available services, actions, and reactions.

## 🔐 Authentication

The platform supports multiple authentication methods:
- Username/password
- OAuth2 (Google, Microsoft, GitHub, Discord)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 Project Structure

```
area/
├── server/         # Backend API server
├── web/            # Next.js web client
├── mobile/         # Flutter mobile app
├── docs-area/      # Documentation site
└── docker-compose.yml
```

## 📄 License

[Add License Information]

## 👥 Team

- Backend Development
- Frontend Development
- Mobile Development
- DevOps & Infrastructure

## 📚 Additional Resources

- [Project Documentation](docs-area/docs/intro.md)
- [API Documentation](server/API_DOCUMENTATION.md)
- [Mobile Client Documentation](mobile/README.md)
