/**
 * Created by KOALA on 29/10/2016.
 */

import * as express from "express";
import * as _ from "lodash";
import * as Utils from "../../utils";
import Settings from "../../settings";
import ProductTypes from "../../productTypes";

const request = require("request");
const tmdb = require("tmdbv3").init(Settings.TMDB_API_KEY);

class SingleMovie {
    private static getImdbMovie(movieId: string, res: express.Response, headerToken: string) {
        tmdb.setLanguage("fr");
        tmdb.movie.info(movieId, function(error: any, data: any) {
            if (!error && data) {
                request.get(Settings.SC_BASE_API_URL + `/search?&access_token=${headerToken}&query=${encodeURIComponent(data.title)}&filter=movies`, function (error: any, response: any, body: any) {
                    if (!error && response.statusCode === 200) {
                        let movie: any = _.find(JSON.parse(body).products, function (item: any) {
                            let yearDataReleaseDate: number = +data.release_date.split("-")[0];
                            if (item.release_date != null && item.year_of_production != null)
                                return ((yearDataReleaseDate >= item.year_of_production) && (yearDataReleaseDate <= +item.release_date.split("-")[0]));
                            if (item.release_date != null)
                                return +item.release_date.split("-")[0] === yearDataReleaseDate;
                            if (item.year_of_production != null)
                                return item.year_of_production === yearDataReleaseDate;
                            return false;
                        });

                        if (movie)
                            res.json({ "product": movie });
                        else
                            res.sendStatus(404);
                    } else {
                        res.sendStatus(response.statusCode);
                    }
                });
            } else {
                res.status(400).json({ message: "This is not a movie" });
            }
        });
    }

    private static async getMovie(movieId: number, res: express.Response, headerToken: string) {
        await Utils.getSCProduct(movieId, headerToken).then((data: [boolean, any]) => {
            if (data == null)
                res.sendStatus(400);
            else if (!data[0])
                res.sendStatus(data[1]);
            else if (data[0]) {
                if (data[1].product.type_id === ProductTypes.Movie)
                    res.json(data[1]);
                else
                    res.status(400).json({ message: "This is not a movie" });
            }
        });
    }

    public static getSingle(req: express.Request, res: express.Response) {
        let headerToken: string = req.get(Settings.HEADER_TOKEN);
        let movieId: any = req.params.movieId;

        if (movieId.match(/tt\d+/i))
            SingleMovie.getImdbMovie(movieId, res, headerToken);
        else
            SingleMovie.getMovie(movieId, res, headerToken);
    }
}

export = SingleMovie.getSingle;