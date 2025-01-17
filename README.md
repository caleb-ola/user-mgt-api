# User Management System

A robust and secure user management system with features such as registration, login, profile management, and device management, built using Node.js, Express, and MongoDB. The system includes secure password handling, email verification via JWT tokens, and the ability to manage multiple devices.

## Features

- **User Registration**: New users can register with email and password. The system securely hashes passwords before storing them.
- **Email Verification**: A JWT-based verification link is sent to the user's email after registration.
- **User Login**: Users can log in with email and password. Successful login returns a JWT token for further requests.
- **Profile Management**: Authenticated users can view and update their profile information (e.g., username, email, password).
- **Device Management**: Users can track devices they're logged in on and can log out from specific devices.
- **Secure Storage**: Passwords are securely stored using bcrypt hashing, and sensitive information is protected.
- **Image Upload**: Users can upload profile images.

## Tech Stack

- **Node.js**: JavaScript runtime for building the API.
- **Express.js**: Web framework for building the server and API routes.
- **MongoDB**: NoSQL database for storing user and device data.
- **JWT (JSON Web Tokens)**: For secure authentication and email verification.
- **Multer**: Middleware for handling file uploads (profile images).
- **bcrypt**: For password hashing and validation.
- **node-device-detector**: For detecting the user's device and client information.
- **Jest**: For unit and integration testing.

## Getting Started

### Prerequisites

- **Node.js**: Ensure Node.js is installed on your system.
- **MongoDB**: You can use a local MongoDB instance or a cloud-based solution like MongoDB Atlas.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/user-management-system.git
