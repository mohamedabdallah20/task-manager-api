# Task Manager API

The Task Manager API is a RESTful web service that provides endpoints for managing users and tasks.

- [Task Manager API](#task-manager-api)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
    - [Set Environment Variables](#set-environment-variables)
    - [Run the Application](#run-the-application)
    - [Testing](#testing)
  - [User Endpoints](#user-endpoints)
    - [Sign Up](#sign-up)
    - [Get Tasks](#get-tasks)
    - [Get Task by ID](#get-task-by-id)
    - [Update Task](#update-task)
    - [Delete Task](#delete-task)
  - [Deployment](#deployment)
  - [Dependencies](#dependencies)
  - [Contributing](#contributing)
  - [Dockerization](#dockerization)
    - [Prerequisites](#prerequisites-1)
    - [Build the Docker Image](#build-the-docker-image)
    - [Access the API](#access-the-api)
  - [License](#license)

## Getting Started

To use the Task Manager API, you can make HTTP requests to the provided endpoints. The base URL for the deployed version is [https://hammo-task-manager-api.onrender.com](https://hammo-task-manager-api.onrender.com).

To run the Task Manager API locally, follow the steps below.

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB server connection details (MONGODB_URL).

### Clone the Repository

```bash
git clone https://github.com/mohamedabdallah20/task-manager-api.git
```

### Install Dependencies

```bash
cd task-manager-api
npm install
```

### Set Environment Variables

Create a .env file in the root directory of the project and add the following environment variables:

```javascript
PORT=3000
SENDGRID_API_KEY=your_sendgrid_key
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
```

Replace your_sendgrid_key, your_mongodb_url, and your_jwt_secret with your actual values.

### Run the Application

```bash
npm start
```

The Task Manager API will start running at `http://localhost:3000`.

### Testing

To run the tests, use the following command:

```bash
npm test
```

you can write your own test cases in test suite `/tests`

## User Endpoints

### Sign Up

- Endpoint: `POST /users`
- Description: Creates a new user.
- Request Body:

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- response

  ```json
  {
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "access_token"
  }
    ```

### Log In

- Endpoint: `POST /users/login`
- Description: Logs in an existing user.
- Request Body:

    ```JSON
    {
    "email": "john@example.com",
    "password": "password123"
    }
    ```

- Response:

    ```JSON
    {
    "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
    },
    "token": "access_token"
    }
    ```

### Log Out

- Endpoint: `POST /users/logout`
- Description: Logs out the current user.
- Authentication required.

### Log Out All Devices

- Endpoint: `POST /users/logoutall`
- Description: Logs out the user from all devices.
- Authentication required.

### Get User Profile

- Endpoint: `GET /users/me`
- Description: Retrieves the profile of the authenticated user.
- Authentication required.

### Update User Profile

- Endpoint: `PATCH /users/me`
- Description: Updates the profile of the authenticated user.
- Request Body (optional):

    ```JSON
    {
    "name": "New Name",
    "age": 30,
    "password": "newpassword"
    }
    ```

- Authentication required.

### Delete User

- Endpoint: `DELETE /users/me`
- Description: Deletes the profile of the authenticated user.
- Authentication required.

### Upload User Avatar

- Endpoint: `POST /users/me/avatar`
- Description: Uploads an avatar image for the authenticated user.
- Authentication required.

### Delete User Avatar

- Endpoint: `DELETE /users/me/avatar`
- Description: Deletes the avatar image of the authenticated user.
- Authentication required.

### Get User Avatar

- Endpoint: `GET /users/:id/avatar`
- Description: Retrieves the avatar image of a user by their ID.

## Task Endpoints

### Create Task

- Endpoint: `POST /tasks`
- Description: Creates a new task.
- Request Body:

    ```JSON
    {
    "description": "Task description"
    }
    ```

- Authentication required.
- Response
  
  ```JSON
    {
    "_id": "task_id",
    "description": "Task description",
    "completed": false,
    "owner": "user_id"
    }
  ```

### Get Tasks

- Endpoint: `GET /tasks`
- Description: Retrieves tasks owned by the authenticated user.
- Authentication required.

### Get Task by ID

- Endpoint: `GET /tasks/:taskId`
- Description: Retrieves a task by its ID.
- Authentication required.

### Update Task

- Endpoint: `PATCH /tasks/:id`
- Description: Updates a task by its ID.
- Request Body (optional):

    ```JSON
    {
    "description": "New task description",
    "completed": true
    }
    ```

- Authentication required.

### Delete Task

- Endpoint: `DELETE /tasks/:id`
- Description: Deletes a task by its ID.
- Authentication required.

## Deployment

The Task Manager API is deployed at [https://hammo-task-manager-api.onrender.com](https://hammo-task-manager-api.onrender.com).

## Dependencies

The Task Manager API uses the following dependencies:

- Express: Fast,  flexible web framework for Node.js.
- MongoDB: NoSQL database used for storing user and task data.
- Multer: Middleware for handling file uploads.
- Sharp: Image processing library for resizing and formatting images.

## Contributing

If you'd like to contribute to the development of the Task Manager API, feel free to fork the repository and submit pull requests.

## Dockerization

To run the Task Manager API in a Docker container, follow these steps:

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine.

### Build the Docker Image

1. Clone the repository:

   ```bash
   git clone https://github.com/mohamedabdallah20/task-manager-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd task-manager-api
   ```

3. Build the Docker image by Docker compose in production mood:

   ```bash
   docker compose -f docker-compose.yml -f docker-compose-dev.yml up -d --build
   ```

   This command will create three Docker images named `task-manager-node-app , mongo-express , mongo` and three Docker containers.

### Access the API

1. Once the container is running, you can access the Task Manager API at:

   ```bash
   http://localhost:8888
   ```

2. you can access the MongoDB UI:

   ```bash
   http://localhost:8081
   ```

3. the stopped the containers, use:

   ```bash
   docker compose -f docker-compose.yml -f docker-compose-dev.yml down
   ```

## License

The Task Manager API is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
