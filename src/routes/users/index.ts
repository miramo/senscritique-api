/**
 * Created by KOALA on 28/10/2016.
 */

const users = require('express').Router();
const me = require('./me');
const single = require('./single');

users.get('/me', me);
users.get('/:userId', single);

export = users;