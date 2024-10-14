# Flux.js

Flux.js is a lightweight, flexible framework that wraps Express.js, providing a structured way to define routes, controllers, and models. It simplifies the development of applications by allowing you to manage all components in a cohesive manner.

## Installation

```bash
npm install flux-js
```

## Features

- **Integrated Routing**: Easily define routes and their controllers in one place.
- **Flexible Models**: Create models that work seamlessly with both MongoDB and PostgreSQL using a common syntax.
- **Password Encryption**: Built-in support for encrypting sensitive data (like passwords) using bcrypt without exposing the implementation details to the user.
- **Future-Ready**: Designed to support additional database integrations in the future.

## Quick Start

### Hello World Example

You can start a simple Flux.js application with a "Hello World" route that handles both GET and POST requests:

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
```

### User Model Example

Flux has built-in encryption at the field definition level, which reduces overhead code. For modularity, you can create a Flux model in a separate file:

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
```

### Starting the Application

To use the User model in your main application file:

```javascript
// app.js
const Flux = require('flux-js').flux({ enable_cors: true });
const config = require('./manifest.js');
const User = require('./user.js'); // Import the User model

Flux.use(config)
Flux.use(User); // Register the User model with Flux

Flux.start(3000, () => {
  console.log('Flux.js server started on port 3000');
});
```

Managing Database Connections
Flux.js abstracts the connection management for MongoDB and PostgreSQL through a manifest file where you define your database configurations. Here's a simplified way to manage both connections:

```javascript
// manifest.js
const flux = require('flux-js').flux();

flux.connect('mongo', {
  uri: 'mongodb://localhost:27017/mydatabase', // MongoDB URI
});

flux.connect('postgres', {
  host: 'localhost',
  user: 'myuser',
  password: 'mypassword',
  database: 'mydatabase', // PostgreSQL database name
});

module.exports = flux
```
This way, you can switch between databases or add more in the future without modifying your models or business logic.

## InBuilt Tokenization

Flux.js allows you to create models easily, with built-in password encryption and token management applicable to any model. Here's how to define a model:

Automatic Password Encryption: Specify encrypt: true in the model to ensure sensitive data is handled securely.
Tokenization of Records: To create a unique token based on specific fields in your model, you can call 
```
this.createToken(['field1', 'field2'], expires='60*60')
```
in the POST request. This abstracts the logic of token generation, allowing you to create secure tokens without extra implementation details. 
To retrieve the token from the request, simply use 
```
this.getToken().
```

Summary of Contents
Basic Usage: Code examples for defining and using models in Flux.js.
Managing Database Connections: Instructions on how to abstractly manage connections to both MongoDB and PostgreSQL through a manifest file.

## Conclusion
Flux.js combines the simplicity of Express.js with powerful features that streamline the development process for applications requiring database integration, secure password management, and token handling. It provides a cohesive structure for managing routes, controllers, and models, making it an ideal choice for backend development.

## Documentation

For more detailed documentation, please visit our [official documentation](https://example.com/flux-js-docs).

## Contributing

We welcome contributions! Please see our [Contributing Guide](https://example.com/contributing) for more details.

## License

Flux.js is released under the MIT License. See the [LICENSE](https://example.com/license) file for more details.
