## Running the Project with Docker

This project includes a Docker setup for easy deployment and consistent development environments. Below are the instructions and requirements specific to this project.

### Requirements
- **Node.js Version:** The Dockerfile uses `node:22.13.1-slim`. No need to install Node.js locally; Docker will handle it.
- **Dependencies:** All Node.js dependencies are installed via `npm ci --production` during the Docker build.

### Environment Variables
- The application can be configured using a `.env` file. If you have environment-specific settings, create a `.env` file in the project root. Uncomment the `env_file: ./.env` line in `docker-compose.yml` to enable this.

### Build and Run Instructions
1. **Build and start the application:**
   ```sh
   docker compose up --build
   ```
   This will build the Docker image and start the `js-app` service.

2. **Access the application:**
   - The app will be available on [http://localhost:3000](http://localhost:3000)

### Ports
- **3000:** The application exposes port 3000. This is mapped to your host machine in the Docker Compose file.

### Special Configuration
- The container runs as a non-root user for improved security.
- No external services (databases, caches) are required or configured by default.
- No persistent volumes are needed for this setup.

If you need to customize environment variables, add them to a `.env` file and uncomment the `env_file` line in `docker-compose.yml`.

---

_If you have additional documentation needs, see `kickdocs.md` and `perspectiveDocs.md` for more details on project functionality._