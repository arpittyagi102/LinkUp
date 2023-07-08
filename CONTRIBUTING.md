# Contributing

Thank you for considering contributing to the LinkUp project! We welcome your contributions to help improve the project and make it even better. Please take a moment to review the guidelines below.

## Getting Started

To run LinkUp locally on your machine, follow these steps:

1. Clone the repository from GitHub:
```bash
git clone https://github.com/your-username/linkup.git
```

2. Install the dependencies for the server:
``` bash
cd linkup-backend
npm install
```

3. Install the dependencies for the client:
```bash
cd ../linkup-frontend
npm install
```

4. Set up the environment variables:
```bash
cp ./env_sample/.env.backend.sample ./linkup-backend/.env
cp ./env_sample/.env.frontend.sample ./linkup-frontend/.env
```

5. Start the development server:
   - Run the server
 ```bash
cd ../linkup-backend
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

## Contributing Guidelines

When contributing to this project, please keep the following guidelines in mind:

- Before starting work on a new feature or bug fix, create an issue to discuss it with the maintainers and the community.

- Fork the repository and create a new branch for your feature or bug fix.

- Ensure your code adheres to the existing code style and follows best practices.

- Write clear and concise commit messages.

- Test your changes thoroughly and ensure that existing tests pass.

- Document any new features or significant changes.

- Make sure to update the README.md file if necessary.

- Submit a pull request with your changes, explaining the motivation and impact of your contribution.

- Be open to feedback and be responsive to any comments or suggestions.

Thank you for your contribution, and happy coding!