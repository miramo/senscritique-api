/**
 * Created by KOALA on 30/10/2016.
 */

import * as express from "express";
import * as request from "request";
import * as _ from "lodash";
import Settings from "../../settings";
import defaults = require("lodash/defaults");

const imdb = require("imdb-api");
const tmdb = require("tmdbv3").init(Settings.TMDB_API_KEY);

function rateMovieByImdbId(rateId: string, res: express.Response, headerToken: string, rating: string, date: string) {
    tmdb.movie.info(rateId, function(errorTmdb: any, dataTmdb: any) {
        if (dataTmdb) {
            request.get(Settings.SC_BASE_API_URL + `/search?&access_token=${headerToken}&query=${encodeURIComponent(dataTmdb.title)}&filter=movies`, function (error: any, response: any, body: any) {
                if (!error && response.statusCode === 200) {
                    let scProducts: any = JSON.parse(body).products;
                    let scProduct: any = _.find(scProducts, function (item: any) {
                        let yearDataReleaseDate: number = +dataTmdb.release_date.split("-")[0];
                        if (item.release_date != null && item.year_of_production != null)
                            return ((yearDataReleaseDate >= item.year_of_production) && (yearDataReleaseDate <= +item.release_date.split("-")[0]));
                        if (item.release_date != null)
                            return +item.release_date.split("-")[0] === yearDataReleaseDate;
                        if (item.year_of_production != null)
                            return item.year_of_production === yearDataReleaseDate;
                        return false;
                    });
                    if (scProduct)
                        rateByInternalId(scProduct.id, res, headerToken, rating, date);
                    else
                        res.sendStatus(404);
                } else {
                    res.sendStatus(response.statusCode);
                }
            });
        } else {
            res.sendStatus(500);
        }
    });
}

function rateShowByImdbId(rateId: string, res: express.Response, headerToken: string, rating: string, date: string) {
    res.sendStatus(418);
}

function rateByImdbId(rateId: string, res: express.Response, headerToken: string, rating: string, date: string) {
    imdb.getById(rateId).then(function(dataImdb: any) {
        tmdb.setLanguage("fr");
        if (dataImdb && dataImdb.type === "movie") {
            rateMovieByImdbId(rateId, res, headerToken, rating, date);
        } else if (dataImdb && dataImdb.type === "series") {
            rateShowByImdbId(rateId, res, headerToken, rating, date);
        } else {
            res.sendStatus(500);
        }
    }).catch(function (error: any) {
        res.sendStatus(412);
    });
}

function rateByInternalId(rateId: number, res: express.Response, headerToken: string, rating: string, date: string) {
    if (rating) {
        request.post({url: Settings.SC_BASE_API_URL + `/products/${rateId}/rate?&access_token=${headerToken}`, form: {rating: rating}}, function(errorRating: any, responseRating: any, bodyRating: any) {
            if (!errorRating && responseRating.statusCode === 200) {
                res.json(JSON.parse(bodyRating));
                if (date)
                    request.post({url: Settings.SC_BASE_API_URL + `/products/${rateId}/date?&access_token=${headerToken}`, form: {date: date}}, function(errorDate: any, responseDate: any, bodyDate: any) {});
            } else {
                res.sendStatus(responseRating.statusCode);
            }
        });
    }
}

export = (req: express.Request, res: express.Response) => {
    let headerToken: string = req.get(Settings.HEADER_TOKEN);
    let rating: string = req.body.rating;
    let date: string = req.body.date;
    let rateId: any = req.params.rateId;

    if (rateId.match(/tt\d+/i))
        rateByImdbId(rateId, res, headerToken, rating, date);
    else
        rateByInternalId(rateId, res, headerToken, rating, date);
};
