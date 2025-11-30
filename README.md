# Home Library Service

Home music library service built with NestJS. Uses **schema-first approach** for Swagger/OpenAPI documentation.

## Repository

https://github.com/snischuk/nodejs2025Q2-service  

## Prerequisites

- Git — [Install Git](https://git-scm.com/downloads)  
- Node.js (v18+) — [Install Node.js](https://nodejs.org/en/download/)

## Setup & Run

Follow these steps:

1. Clone the repository and go into the project folder:

   git clone https://github.com/snischuk/nodejs2025Q2-service.git && cd nodejs2025Q2-service

2. Install dependencies, start the application in development mode, and run tests:

   npm install && npm run start:dev

   (In a separate terminal, if the app is running, run tests:)

   npm run test

The server runs on port `4000` by default. Swagger documentation is available at: [http://localhost:4000/doc](http://localhost:4000/doc)

---

## Build for Production

Before building, it's recommended to clean the `dist` folder:

npm run prebuild && npm run build

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

## Notes

- **Swagger/OpenAPI** documentation is based on a schema-first approach.
- Ensure you run `npm run start:dev` **before running tests** if using e2e tests.
- `npm run prebuild` + `npm run build` is needed for production builds.
