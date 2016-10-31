/**
 * Created by KOALA on 30/10/2016.
 */

import * as express from "express";
import {Settings} from "../../settings";

const request = require("request");

const FILTER_TYPE: any = {
    "undefined" : "",
    "movie"     : "movies",
    "show"      : "tvshows",
    "game"      : "videogames",
    "book"      : "books",
    "comic"     : "comics",
    "music"     : "musics",
};

export = (req: express.Request, res: express.Response) => {
    let headerToken: string = req.get(Settings.HEADER_TOKEN);
    let type: string = req.params.type;
    let query: string = req.query.query;

    if (!query) {
        res.status(412).json({ message: "Query is missing or empty" });
        return;
    }
    if (FILTER_TYPE[type] == null) {
        res.status(412).json({ message: "This is not a valid type" });
        return;
    }

    request.get(Settings.SC_BASE_API_URL + `/search?&access_token=${headerToken}&query=${query}&filter=${FILTER_TYPE[type]}`, function (error: any, response: any, body: any) {
        if (!error && response.statusCode === 200) {
            res.json(JSON.parse(body));
        } else {
            res.sendStatus(response.statusCode);
        }
    });
};