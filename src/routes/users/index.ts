/**
 * Created by KOALA on 28/10/2016.
 */

const users = require('express').Router();
const me = require('./me');

users.get('/me', me);

export = users;