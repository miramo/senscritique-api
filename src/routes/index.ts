/**
 * Created by KOALA on 28/10/2016.
 */

import * as express from "express";

const routes = require('express').Router();
const auth = require('./auth/login');
const users = require('./users');

routes.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
    next();
});

routes.use('/users', users);

routes.post('/auth/login', auth);

routes.get('/', (req : express.Request, res : express.Response) => {
    res.status(200).json({ message: 'Connected!' });
});

export = routes;