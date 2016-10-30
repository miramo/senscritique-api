/**
 * Created by KOALA on 29/10/2016.
 */

const movies = require('express').Router();
const single = require('./single');
const popular = require('./popular');

movies.get('/popular', popular);
movies.get('/:movieId', single);

export = movies;