# Home Library Service

Home music library service built with NestJS. Uses **schema-first approach** for Swagger/OpenAPI documentation.

## Repository

https://github.com/snischuk/nodejs2025Q2-service  

## Prerequisites

- Git — [Install Git](https://git-scm.com/downloads)  
- Node.js (v18+) — [Install Node.js](https://nodejs.org/en/download/)
- Docker & Docker Compose - install from [Docker official site](https://docs.docker.com/get-docker/)

## Setup & Run

Follow these steps:

1. Clone the repository:

   git clone https://github.com/snischuk/nodejs2025Q2-service.git

2. Go into the project folder:

   cd nodejs2025Q2-service

3. Switch to the dev branch:

   git switch dev-part-2

4. Install dependencies:

   npm install

5. Start the application in development mode:

   npm run start:dev

6. (In a separate terminal, if the app is running) Run tests:

   npm run test

Don't forget `cp .env.example .env`
The server runs on port `4000` by default. Swagger documentation is available at: [http://localhost:4000/doc](http://localhost:4000/doc)

---
## Running application with Docker
   `npm run docker:up:build` — builds Docker images and starts database & app services
or `npm run docker:up` — just starts services without building

Application runs in development mode, rebuilds automatically on code changes

Stop running containers:
- `npm run docker:stop`
- `npm run docker:down`
- `npm run docker:down:volumes`

Built images pushed to DockerHub:
- `snischuk/nodejs2025q3-service-app:latest`
- `snischuk/nodejs2025-postgres-db:latest`

Full vulnerability view:
- `npm run docker:scan:app:cves`
- `npm run docker:scan:db:cves`

Quick overview:
- `npm run docker:scan:app:quickview`
- `npm run docker:scan:db:quickview`

## Build for Production

Before building, it's recommended to clean the `dist` folder:

npm run prebuild
npm run build

- `prebuild` — removes the `dist` folder.  
- `build` — compiles the NestJS application to the `dist` folder.  

After building, you can run the compiled app with:

node dist/main.js

---

## API Endpoints

| Method | Endpoint                  | Description                           |
|--------|---------------------------|---------------------------------------|
| GET    | /user                     | Get all users                          |
| POST   | /user                     | Create a new user                      |
| GET    | /user/:userId             | Get user by ID                         |
| PUT    | /user/:userId             | Update user password                   |
| DELETE | /user/:userId             | Delete user                            |
| GET    | /track                    | Get all tracks                         |
| POST   | /track                    | Add new track                          |
| GET    | /track/:id                | Get track by ID                        |
| PUT    | /track/:id                | Update track information               |
| DELETE | /track/:id                | Delete track                           |
| GET    | /album                    | Get all albums                         |
| POST   | /album                    | Add new album                           |
| GET    | /album/:id                | Get album by ID                         |
| PUT    | /album/:id                | Update album information               |
| DELETE | /album/:id                | Delete album                            |
| GET    | /artist                   | Get all artists                         |
| POST   | /artist                   | Add new artist                          |
| GET    | /artist/:id               | Get artist by ID                        |
| PUT    | /artist/:id               | Update artist information               |
| DELETE | /artist/:id               | Delete artist                            |
| GET    | /favs                     | Get all favorites                       |
| POST   | /favs/track/:id           | Add track to favorites                  |
| DELETE | /favs/track/:id           | Remove track from favorites             |
| POST   | /favs/album/:id           | Add album to favorites                  |
| DELETE | /favs/album/:id           | Remove album from favorites             |
| POST   | /favs/artist/:id          | Add artist to favorites                 |
| DELETE | /favs/artist/:id          | Remove artist from favorites            |

---

