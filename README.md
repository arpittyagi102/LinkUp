<h1 align="center">✨ Get Link Up with your friends 🔗</h1>
<br/>
<div align="center">
 <img src="https://img.shields.io/github/issues-raw/arpittyagi102/linkup?style=for-the-badge&labelColor=371B1E&color=A120A2"/>
 <img src="https://img.shields.io/github/contributors/arpittyagi102/linkup?style=for-the-badge&labelColor=371B1E&color=A120A2&link=https%3A%2F%2Fgithub.com%2Farpittyagi102%2FLinkUp%2Fgraphs%2Fcontributors"/>
 <img src="https://img.shields.io/github/stars/arpittyagi102/linkup?style=for-the-badge&labelColor=371B1E&color=A120A2"/>
 <img src="https://img.shields.io/github/forks/arpittyagi102/linkup?style=for-the-badge&labelColor=371B1E&color=A120A2"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&labelColor=371B1E&color=A120A2"/> 
</div> 
<br/>
Welcome to the LinkUp! This is a MERN stack project that provides an attractive and seamless chatting experience. With its user-friendly interface and advanced features, this application allows users to engage in real-time conversations with others, keeping them connected and up to date.

![](docs/Assets/linkup-signup-ss.png)

## Table of contents

- 📋 [Documentation](./docs)
- 🚀 [Features](#features)
- 📦 [Installation and Setup](#Installation-and-setup)
- 📝 [Contributing](#contributing)
- ⚖️ [License](./license)
- ✨ [Contributors](#contributors)
- 🤝 [Contact](#contact)

## Features

- **Secure Authentication**: Enjoy a secure login and signup process, with options for traditional credentials and seamless Google authentication. User data is encrypted using the bcrypt algorithm to ensure maximum privacy.

- **Persistent User Data**: User data is securely stored and managed in a MongoDB database. This ensures that user information is readily available for seamless sign-in and personalized chat experiences.

- **Attractive and Aesthetic Interface**: The chat interface is thoughtfully designed with a modern and appealing look. Enjoy a visually pleasing experience that enhances your conversations and keeps you engaged.

- **Online Status and Last Seen**: Stay informed about the availability of your chat contacts. The application provides online status indicators and last seen timestamps, allowing you to know when your contacts are active or when they were last active.

## Libraries used in Frontend

- react-router-dom
- socket.io-client
- @react-oauth/google
- axios
- jsonwebtoken
- js-cookie
- bootstrap

## Libraries used in Backend

- bcrypt
- express
- cors
- nodemon
- socket.io
- dotenv

## Installation and setup

To run LinkUp locally on your machine, follow these steps:

1. Clone the repository from GitHub:

```bash
git clone https://github.com/your-username/linkup.git
```

2. Install the dependencies for the server:

```bash
cd linkup-backend
npm install
```

3. Install the dependencies for the client:

```bash
cd ../linkup-frontend
npm install
```

4. Set up the environment variables:

```
cp ./env_sample/.env.backend.sample ./linkup-backend/.env
cp ./env_sample/.env.frontend.sample ./linkup-frontend/.env
```

5. Start the development server:

- Run the server:

```bash
cd ../linkup-backent
npm start
```

- Run the client:

```bash
cd ../linkup-frontend
npm start
```

6. Access LinkUp in your web browser:

```bash
http://localhost:3000
```

# For automatic setup

run `setup.sh` in terminal

## Contributing

We welcome contributions from the community to enhance LinkUp further. To contribute, please follow these steps:

1. Fork the repository.

2. Create a new branch for your feature or bug fix.

3. Commit your changes and push them to your branch.

4. Submit a pull request, clearly documenting the changes and their purpose.
5. For testing purpose you may use these credentials

```json
"email":"rohitsharma@gmail.com",
"password":123456
```

```json
"email":"viratkohli@gmail.com",
"password":123456
```

We will review your pull request, provide feedback if necessary, and merge it once it meets the project's standards.

## Contact

If you have any questions, suggestions, or feedback regarding LinkUp, please feel free to contact us at arpittyagi102@gmail.com
