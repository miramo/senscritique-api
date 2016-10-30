/**
 * Created by KOALA on 30/10/2016.
 */

import * as express from "express";
import * as _ from "lodash";
import {Settings} from "../../settings";

const request = require('request');
const imdb = require('imdb-api');

class SingleRate {
    public static rateByImdbId(rateId: string, res : express.Response, headerToken: string, rating: string, date: string) {
        imdb.getById(rateId).then(function(data: any) {
            request.get(Settings.SC_BASE_API_URL + `/search?&access_token=${headerToken}&query=${data.title}`, function (error: any, response: any, body: any) {
                if (!error && response.statusCode == 200) {
                    let products: any = JSON.parse(body).products;

                    let scProduct: any = _.find(products, { 'year_of_production': data.year });
                    if (scProduct)
                        SingleRate.rateByInternalId(scProduct.id, res, headerToken, rating, date);
                    else
                        res.sendStatus(response.statusCode);
                } else {
                    res.sendStatus(response.statusCode);
                }
            });
        });
    }

    public static rateByInternalId(rateId: number, res : express.Response, headerToken: string, rating: string, date: string) {
        if (rating) {
            request.post({url: Settings.SC_BASE_API_URL + `/products/${rateId}/rate?&access_token=${headerToken}`, form: {rating: rating}}, function(errorRating: any, responseRating: any, bodyRating: any) {
                if (!errorRating && responseRating.statusCode == 200) {
                    res.json(JSON.parse(bodyRating));
                    if (date)
                        request.post({url: Settings.SC_BASE_API_URL + `/products/${rateId}/date?&access_token=${headerToken}`, form: {date: date}}, function(errorDate: any, responseDate: any, bodyDate: any) {});
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
        let rateId: any = req.params.rateId;

        if (rateId.match(/tt\d+/i))
            SingleRate.rateByImdbId(rateId, res, headerToken, rating, date);
        else
            SingleRate.rateByInternalId(rateId, res, headerToken, rating, date);
    }

}

export = SingleRate.postRate