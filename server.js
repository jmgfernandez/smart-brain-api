const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// import express from 'express';
// import bcrypt from 'bcrypt-nodejs';
// import cors from 'cors';
// import knex from 'knex';

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// import register from './controllers/register.js';
// import signin from './controllers/signin.js';
// import profile from './controllers/profile.js';
// import { handleImage, handleApiCall } from './controllers/image.js';

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host : process.env.DATABASE_HOST,
    port : 5432,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PW,
    database : process.env.DATABASE_DB
  }
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.send('success'); });

app.post('/signin', signin.handleSignin(bcrypt, db));

// app.post('/signin', (req, res) => { signin(req, res, bcrypt, db) });

app.post('/register', (req, res) => { register.handleRegister(req, res, bcrypt, db) });

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });


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