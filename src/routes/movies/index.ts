/**
 * Created by KOALA on 29/10/2016.
 */

const movies = require("express").Router();
const single = require("./single");
const popular = require("./popular");
const outWeek = require("./outWeek");
const inTheaters = require("./inTheaters");

movies.get("/popular", popular);
movies.get("/out_week", outWeek);
movies.get("/in_theaters", inTheaters);
movies.get("/:movieId", single);

export = movies;