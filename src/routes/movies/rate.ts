/**
 * Created by KOALA on 30/10/2016.
 */

import * as express from "express";
import * as _ from "lodash";
import {Settings} from "../../settings";

const request = require('request');
const imdb = require('imdb-api');

class Rate {
    public static rateImdbMovie(movieId: string, res : express.Response, headerToken: string, rating: string, date: string) {
        imdb.getById(movieId).then(function(data: any) {
            request.get(Settings.SC_BASE_API_URL + `/search?&access_token=${headerToken}&query=${data.title}`, function (error: any, response: any, body: any) {
                if (!error && response.statusCode == 200) {
                    let products: any = JSON.parse(body).products;

                    let movie: any = _.find(products, { 'type_id': 1, 'year_of_production': data.year });
                    if (movie)
                        Rate.rateMovie(movie.id, res, headerToken, rating, date);
                    else
                        res.sendStatus(response.statusCode);
                } else {
                    res.sendStatus(response.statusCode);
                }
            });
        });
    }

    public static rateMovie(movieId: number, res : express.Response, headerToken: string, rating: string, date: string) {
        if (rating) {
            request.post({url: Settings.SC_BASE_API_URL + `/products/${movieId}/rate?&access_token=${headerToken}`, form: {rating: rating}}, function(errorRating: any, responseRating: any, bodyRating: any) {
                if (!errorRating && responseRating.statusCode == 200) {
                    res.json(JSON.parse(bodyRating));
                    if (date)
                        request.post({url: Settings.SC_BASE_API_URL + `/products/${movieId}/date?&access_token=${headerToken}`, form: {date: date}}, function(errorDate: any, responseDate: any, bodyDate: any) {});
                } else {
                    res.sendStatus(responseRating.statusCode);
                }
            });
        }
    }

    public static postRate(req : express.Request, res : express.Response) {
        let headerToken: string = req.get(Settings.HEADER_TOKEN);
        let rating: string = req.body.rating;
        let date: string = req.body.date;
        let movieId: any = req.params.movieId;

        if (movieId.match(/tt\d+/i)) {
            Rate.rateImdbMovie(movieId, res, headerToken, rating, date);
        } else {
            Rate.rateMovie(movieId, res, headerToken, rating, date);
        }
    }

}

export = Rate.postRate