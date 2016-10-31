/**
 * Created by KOALA on 28/10/2016.
 */

import * as express from "express";

const routes = require("express").Router();
const status = require("./status");
const login = require("./login");
const users = require("./users");
const movies = require("./movies");
const search = require("./search");
const rate = require("./rate");

// Middleware
routes.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
    next();
});

routes.use("/users", users);
routes.use("/movies", movies);
routes.use("/search", search);
routes.use("/rate", rate);

routes.get("/status", status);
routes.post("/auth/login", login);

export = routes;