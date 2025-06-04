# Gym Pass API

RESTful API for a Gym Pass system that manages user check-ins, gym locations, and membership validations

## Installation

```bash
# Clone the repository
https://github.com/joas-vieira/gym-pass-api.git
git@github.com:joas-vieira/gym-pass-api.git

# Navigate into the project folder
cd gym-pass-api
```

## How to Use

```bash
# Install dependencies
npm install

# Create a .env file based on the .env.example
cp .env.example .env

# Up the Docker containers
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run start:dev
```

## Testing

```bash
# Run unit tests
npm run test:unit

# Run e2e tests
npm run test:e2e
```
