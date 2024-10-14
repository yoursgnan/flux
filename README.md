# Flux.js

Flux.js is a lightweight, flexible framework that wraps Express.js, providing a structured way to define routes, controllers, and models. It simplifies the development of applications by allowing you to manage all components in a cohesive manner.

npm install flux-js

## Features

- **Integrated Routing**: Easily define routes and their controllers in one place.
- **Flexible Models**: Create models that work seamlessly with both MongoDB and PostgreSQL using a common syntax.
- **Password Encryption**: Built-in support for encrypting sensitive data (like passwords) using bcrypt without exposing the implementation details to the user.
- **Future-Ready**: Designed to support additional database integrations in the future.

## Quick Start

### Hello World Example

You can start a simple Flux.js application with a "Hello World" route that handles both GET and POST requests like this:

```javascript
const Flux = require('flux-js').flux({ enable_cors: true });

// Define the HelloWorld route
const HelloWorld = Flux.route('/hello')
  .controller({
    // Handle GET requests
    get: (req, res) => {
      res.json({ message: 'Hello, World!' });
    },
    // Handle POST requests
    post: (req, res) => {
      const { greeting } = req.body;
      res.json({ message: greeting || 'Hello, World!' });
    },
  });

// Register the HelloWorld route with Flux
Flux.use(HelloWorld);

// Start the server
Flux.start(3000, () => {
  console.log('Flux.js server started on port 3000');
});

Flux has inbuilt encryption at field definition level, which will reduce lot of overhead code
and also for modularity , you can create flux model in seperate file and use it as below
```javascript
// user.js
const Flux = require('flux-js').flux();

const User = Flux.route('/user')
  .model({
    username: Flux.Model.char({ required: true, unique: true }),
    email: Flux.Model.char({ required: true, unique: true }),
    password: Flux.Model.char({ required: true, encrypt: true }), // Automatically encrypted
  })
  .controller({
    // Define controller actions
    get: (req, res) => {
      return {
        '/': () => {
          return this.find({})
            .then(users => res.json(users))
            .catch(error => res.status(500).json({ error: 'Failed to fetch users' }));
        },
        '/:username': () => {
          const { username } = req.params;
          return this.findOne({ username })
            .then(user => {
              if (user) {
                res.json(user);
              } else {
                res.status(404).json({ error: 'User not found' });
              }
            })
            .catch(error => res.status(500).json({ error: 'Failed to fetch user' }));
        },
      };
    },
    post: (req, res) => {
      const body = req.body; // Automatically handles encryption

      return this.create(body)
        .then(newUser => res.status(201).json(newUser))
        .catch(error => res.status(400).json({ error: 'Failed to create user' }));
    },
  });

module.exports = User;


\\app.js
```javascript
// main.js
const Flux = require('flux-js').flux({ enable_cors: true });
const User = require('./user.js'); // Import the User model

Flux.use(User); // Register the User model with Flux

Flux.start(3000, () => {
  console.log('Flux.js server started on port 3000');
});



### Summary of Contents

1. **Hello World Example**: A simple Flux application that handles both GET and POST requests at the `/hello` route.
2. **User Model Example**: Detailed implementation of a User model with automatic password encryption and defined routes for retrieving and creating users.
3. **Starting the Application**: Instructions for initializing and running the Flux.js server.

This README now explicitly mentions and includes the User model code, along with the Hello World example and the complete startup instructions for using Flux.js.
