# Dockeryard
## Overview

Dockeryard is a modular web application designed to explore and manage the history and life of the Dockyard. The project is divided into several components, including two frontend applications and multiple backend services, all orchestrated with Docker.

## Frontend

- **Fun App**: An interactive React application focused on engaging and entertaining features related to the Dockyard.
- **Admin App**: A React-based administrative interface for managing data and content.
- Both frontends use [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/) for rapid development and modern UI.

## Backend

- **History Service**: Handles all data and APIs related to the historical aspects of the Dockyard.
- **Search Service**: Provides an API for searching people who have worked at the Dockyard.
- **Life Service**: Manages information about the daily life and experiences of people at the Dockyard.

## Getting Started

All components are containerized using Docker for easy setup and deployment.

### Prerequisites

- [Docker](https://www.docker.com/) installed on your machine.

### Running the Project

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/dockyard.git
    cd dockyard
    ```
2. Start all services:
    ```bash
    docker-compose up --build
    ```
3. Access the applications:
    - Fun App: [http://localhost:5000](http://localhost:5000)
    - Admin App: [http://localhost:3000](http://localhost:3000)
    - Backend APIs: See `docker-compose.yml` for exposed ports.

## Project Structure

```
/frontend-fun      # Fun React app
/frontend-admin    # Admin React app
/backend-history   # History service
/backend-search    # Search service
/backend-life      # Life service
/docker-compose.yml
```

## Contributing

Feel free to open issues or submit pull requests to improve the project.

## License

This project is licensed under the MIT License.