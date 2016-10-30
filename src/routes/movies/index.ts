/**
 * Created by KOALA on 29/10/2016.
 */

const movies = require('express').Router();
const single = require('./single');
const popular = require('./popular');
const rate = require('./rate');

movies.get('/popular', popular);
movies.get('/:movieId', single);

movies.post('/:movieId/rate', rate);

export = movies;