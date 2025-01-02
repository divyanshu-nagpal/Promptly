# Promptly

Promptly is a dynamic web platform built on the MERN stack (MongoDB, Express, React, Node.js) that allows users to share and discover creative prompts from various sources. Designed for a collaborative community, Promptly inspires creativity and provides a space for users to engage and share ideas.

## Features

- **Prompt Sharing**: Users can create and share prompts with the community.
- **Prompt Discovery**: Browse and search prompts shared by others.
- **User Profiles**: Each user has a profile to showcase their contributions.
- **Interactive Community**: Like, comment, and interact with prompts.
- **Multi-Source Support**: Prompts from various categories and topics.

## Tech Stack

- **Frontend**: React.js with modern UI/UX design principles.
- **Backend**: Node.js and Express.js for API and server-side logic.
- **Database**: MongoDB for storing user data and prompts.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/divyanshu-nagpal/promptly.git
   cd promptly
   ```

2. Install dependencies for both the client and server:
   ```bash
   # Install Backend dependencies
   cd Backend
   npm install

   # Install Frontend dependencies
   cd ../Frontend
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `server` directory and add the following:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```

4. Run the development environment:
   ```bash
   # Start the server
   cd Backend
   npm run dev

   # Start the client
   cd ../client
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Folder Structure

```
promptly/
├── Frontend/       # Frontend code (React)
├── Backend/       # Backend code (Express)
├── README.md     # Project documentation
└── .gitignore    # Git ignored files
```


## License

This project is licensed under the GPL-3.0 License. See the [LICENSE](LICENSE) file for details.

