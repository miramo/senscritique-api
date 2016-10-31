/**
 * Created by KOALA on 29/10/2016.
 */

import * as express from "express";
import * as _ from "lodash";
import {Settings} from "../../settings";

const request = require("request");
const imdb = require("imdb-api");

class SingleMovie {
    public static getImdbMovie(movieId: string, res: express.Response, headerToken: string) {
        imdb.getById(movieId).then(function(data: any) {
            request.get(Settings.SC_BASE_API_URL + `/search?&access_token=${headerToken}&query=${data.title}&filter=movies`, function (error: any, response: any, body: any) {
                if (!error && response.statusCode === 200) {
                    let products: any = JSON.parse(body).products;

                    let movie: any = _.find(products, { "year_of_production": data.year });
                    if (movie) {
                        let product = { "product": movie };
                        res.json(product);
                    } else {
                        res.sendStatus(404);
                    }
                } else {
                    res.sendStatus(response.statusCode);
                }
            });
        });
    }

    public static getMovie(movieId: number, res: express.Response, headerToken: string) {
        request.get(Settings.SC_BASE_API_URL + `/products/${movieId}?&access_token=${headerToken}`, function (error: any, response: any, body: any) {
            if (!error && response.statusCode === 200) {
                let jsonBody: any = JSON.parse(body);

                if (jsonBody.product.type_id === 1)
                    res.json(jsonBody);
                else
                    res.status(400).json({ message: "This is not a movie" });
            } else {
                res.sendStatus(response.statusCode);
            }
        });
    }

    public static getSingle(req: express.Request, res: express.Response) {
        let headerToken: string = req.get(Settings.HEADER_TOKEN);
        let movieId: any = req.params.movieId;

        if (movieId.match(/tt\d+/i)) {
            SingleMovie.getImdbMovie(movieId, res, headerToken);
        } else {
            SingleMovie.getMovie(movieId, res, headerToken);
        }
    }

}

export = SingleMovie.getSingle;