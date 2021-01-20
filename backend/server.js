import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose'; 
import crypto from 'crypto'; 
import bcrypt from 'bcrypt-nodejs'; 

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/karahkaAPI"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
mongoose.set('useCreateIndex', true);

const User = mongoose.model('User', {
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex',)
  }
});

const port = process.env.PORT || 8080
const app = express()

const authenticateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      accessToken: req.header('Authorization'),
    });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(403).json({ message: 'Log in to access this.' });
    } 
  } catch (err) {
    res.status(400).json({ message: 'No access', errors: err.errors });
  }
};

// middlewares
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// SIGNUP USER
app.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = new User({ firstName, lastName, email, password: bcrypt.hashSync(password) });
    const newUser = await user.save();
    res.status(201).json({
      accessToken: newUser.accessToken,
      userId: newUser._id,
      message: 'Account created',
    });
  } catch (err) {
    res.status(400).json({ message: 'Unable to create account', errors: err.errors });
  }
});

// LOGIN USER
app.post('/sessions', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      req.status(201).json({ userId: user._id, accessToken: user.accessToken, firstName: user.firstName });
    } else {
      res.json({ notFound: true });
    }
  
  } catch (err) {
    res.status(400).json({ message: 'Unable to login to account', errors: err.errors });
  }
});

// AUTHORIZATION ENDPOINT
app.get('/users/:id', authenticateUser);
app.get('/users/:id', (req, res) => {
  const loginMessage = `$req.user.firstName`;
  res.status(201).json({ loginMessage });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

