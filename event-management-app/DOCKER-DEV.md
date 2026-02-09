# Docker Development Mode - Hot Reload Setup

This guide explains how to use the development mode with hot reload, so you can see changes immediately without rebuilding.

## Quick Start

### For Development (Hot Reload):
```powershell
# Stop the production frontend
docker-compose stop frontend

# Start development mode (with hot reload)
docker-compose --profile dev up -d frontend-dev
```

Now when you make changes to files in `frontend/src/`, they will automatically appear in your browser!

### For Production (Build):
```powershell
# Stop the dev frontend
docker-compose stop frontend-dev

# Start production mode
docker-compose up -d frontend
```

## How It Works

- **Development Mode (`frontend-dev`)**: 
  - Uses volume mounts to sync your local files with the container
  - Runs `npm run dev` which has hot reload enabled
  - Changes are reflected immediately (usually within 1-2 seconds)
  
- **Production Mode (`frontend`)**: 
  - Builds static files and serves them with nginx
  - Faster performance, but requires rebuild for changes

## Switching Between Modes

**To switch from Production to Development:**
```powershell
docker-compose stop frontend
docker-compose --profile dev up -d frontend-dev
```

**To switch from Development to Production:**
```powershell
docker-compose stop frontend-dev
docker-compose up -d frontend
```

## Notes

- Both services use port 3000, so only run one at a time
- The dev mode uses Docker profiles, so you need `--profile dev` flag
- Hot reload works for all files in `frontend/src/` directory
- The backend and database continue running normally

