const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
};

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    // // Load hash from your password DB. 
    // bcrypt.compare('apples', '$2a$10$uH9mfhiA8MdOxnkllDralOW2X..guN.PUu47Hb6h55Eaj4RuVqj32', function(err, res) {
    //     console.log('first guess', res);
    // })

    // bcrypt.compare('veggies', '$2a$10$uH9mfhiA8MdOxnkllDralOW2X..guN.PUu47Hb6h55Eaj4RuVqj32', function(err, res) {
    //     console.log('second guess', res);
    // })
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json('error logging in');
        }
    res.json('signing');
});

app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash);
    // });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        // password: password, 
        // this is not the best solution imo as newly registered user
        // won't have a password in the DB
        entries: 0,
        joined: new Date()
    });
    res.json(database.users.at(-1))
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    });
    if (!found) {
        res.status(400).json('not found');
    }
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        } 
    });
    if (!found) {
        res.status(400).json('not found');
    }
});

// bcrypt.hash('bacon', null, null, function(err, hash) {
//     // Store hash in your password DB.
// })

// // Load hash from your password DB. 
// bcrypt.compare('bacon', hash, function(err, res) {
//     // res == true
// })

// bcrypt.compare('veggies', hash, function(err, res) {
//     // res == false
// })

app.listen(3000, () => {
    console.log('app is running on port 3000');
});

/* Planning our APIs
Route       Request     Response
/ --> this is working
/signin --> POST = success/fail
👆 The method for signin is POST because we don't want to send passwords 
as a query string
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
👆 a counter for how many images a user has submited
*/