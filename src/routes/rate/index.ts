/**
 * Created by KOALA on 30/10/2016.
 */

const rate = require('express').Router();
const single = require('./single');

rate.post('/:rateId', single);

export = rate;