# Home Library Service

Home music library service built with NestJS. Uses **schema-first approach** for Swagger/OpenAPI documentation.

## Repository

https://github.com/snischuk/nodejs2025Q2-service

## Prerequisites

- Git — [Install Git](https://git-scm.com/downloads)
- Node.js (v18+) — [Install Node.js](https://nodejs.org/en/download/)
- Docker & Docker Compose - install from [Docker official site](https://docs.docker.com/get-docker/)

## Setup & Run (without Docker)

Follow these steps:

1. Clone the repository:

   git clone https://github.com/snischuk/nodejs2025Q2-service.git

2. Go into the project folder:

   cd nodejs2025Q2-service

3. Switch to the dev branch:

   git switch dev-part-2

4. Install dependencies:

   npm install

---

## Useful commands before starting Docker:

#### Stop & remove all containers

`docker stop $(docker ps -aq) && docker rm $(docker ps -aq)`

#### Remove all images

`docker rmi -f $(docker images -aq)`

#### Remove all volumes

`docker volume ls -q | xargs -r docker volume rm`

# Running application with Docker

### Development

1.  Copy environment varibales based on example files:
    `cp .env.dev.example .env.dev` and
    `cp .env.prod.example .env.prod`

2.  Start the containers:
    `npm run docker:up:dev`

3.  If the application fails to start due to migration errors, open a second terminal:
    `docker exec -it nodejs2025-service_app_dev sh`

4.  Inside the container terminal (/usr/src/app), run the migrations:
    `npx prisma migrate dev`

5.  After the migrations are successfully applied (and the database in the container is up!), you can run the tests:
    `npm run test`

Note: Application in development mode rebuilds automatically on code changes

### Production

Start the optimized version (<500Mb):
`npm run docker:up:prod`

If you uncomment **image** field in **docker-compose.prod.yml** file, the images will be pulled from Docker Hub:

- Application: [`snischuk/nodejs2025q2-service-app`](https://hub.docker.com/repository/docker/snischuk/nodejs2025q2-service-app/tags)
- Database: [`snischuk/nodejs2025q2-service-database`](https://hub.docker.com/repository/docker/snischuk/nodejs2025q2-service-database/tags)

Full vulnerability view:

- `npm run docker:scan:app:cves`
- `npm run docker:scan:db:cves`

Quick overview:

- `npm run docker:scan:app:quickview`
- `npm run docker:scan:db:quickview`

---

## API Endpoints

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| GET    | /user            | Get all users                |
| POST   | /user            | Create a new user            |
| GET    | /user/:userId    | Get user by ID               |
| PUT    | /user/:userId    | Update user password         |
| DELETE | /user/:userId    | Delete user                  |
| GET    | /track           | Get all tracks               |
| POST   | /track           | Add new track                |
| GET    | /track/:id       | Get track by ID              |
| PUT    | /track/:id       | Update track information     |
| DELETE | /track/:id       | Delete track                 |
| GET    | /album           | Get all albums               |
| POST   | /album           | Add new album                |
| GET    | /album/:id       | Get album by ID              |
| PUT    | /album/:id       | Update album information     |
| DELETE | /album/:id       | Delete album                 |
| GET    | /artist          | Get all artists              |
| POST   | /artist          | Add new artist               |
| GET    | /artist/:id      | Get artist by ID             |
| PUT    | /artist/:id      | Update artist information    |
| DELETE | /artist/:id      | Delete artist                |
| GET    | /favs            | Get all favorites            |
| POST   | /favs/track/:id  | Add track to favorites       |
| DELETE | /favs/track/:id  | Remove track from favorites  |
| POST   | /favs/album/:id  | Add album to favorites       |
| DELETE | /favs/album/:id  | Remove album from favorites  |
| POST   | /favs/artist/:id | Add artist to favorites      |
| DELETE | /favs/artist/:id | Remove artist from favorites |

---
