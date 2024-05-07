# File Formatting App

This app combines a React frontend with a Node.js API to display formatted file data

# Frontend

This consists of a React app that displays formatted file data.

## Running locally

Make sure you have Node.js (version 16) installed on your system.

Clone this repository to your local machine:

```bash
  git clone <repository-url>
```

Navigate to the project directory:

```bash
  cd frontend
```

Install the dependencies:

```bash
  npm install
```

Start the development server:

```bash
  npm start
```

## Running with Docker

Make sure you have Docker installed on your system.

Clone this repository to your local machine:

```bash
  git clone <repository-url>
```

Navigate to the project directory:

```bash
  cd frontend
```

Build the Docker image:

```bash
  docker build -t frontend .
```

Run the Docker container:

```bash
  docker run -p 80:80 frontend
```

Open your web browser and visit http://localhost to see the application.

## Testing

To run the tests for the application, use the following command:

```bash
  npm test
```

## Building for Production

To build the application for production, use the following command:

```bash
  npm run build
```

This will create an optimized production build in the build directory.

# File Formatting API

This is the Node.js File Formatting API that is used by the frontend.

## Running locally

Make sure you have Node.js (version 14) installed on your system.

Clone this repository to your local machine:

```bash
  git clone <repository-url>
```

Navigate to the project directory:

```bash
  cd api
```

Install the dependencies:

```bash
  npm install
```

Start the development server:

```bash
  npm start
```

The API will be accessible at http://localhost:4000.

## Running with Docker

Make sure you have Docker installed on your system.

Clone this repository to your local machine:

```bash
  git clone <repository-url>
```

Navigate to the project directory:

```bash
  cd api
```

Build the Docker image:

```bash
  docker build -t api .
```

Run the Docker container:

```bash
  docker run -p 4000:4000 api
```

The API will be accessible at http://localhost:4000.

## Testing

To run the tests for the application, use the following command:

```bash
  npm test
```

## Linting

To lint the code using the Standard linter, use the following command:

```bash
  npm run lint
```
