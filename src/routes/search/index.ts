/**
 * Created by KOALA on 30/10/2016.
 */

const search = require("express").Router();
const single = require("./single");

search.get("/", single);
search.get("/:type", single);

export = search;