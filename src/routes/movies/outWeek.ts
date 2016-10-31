/**
 * Created by KOALA on 31/10/2016.
 */

import * as express from "express";
import {Settings} from "../../settings";
import {ProductTypes} from "../../productTypes";

const request = require("request");

export = (req: express.Request, res: express.Response) => {
    let headerToken: string = req.get(Settings.HEADER_TOKEN);

    request.get(Settings.SC_BASE_API_URL + `/movies/out_week?&access_token=${headerToken}&type_id=${ProductTypes.Movie}`, function (error: any, response: any, body: any) {
        if (!error && response.statusCode === 200) {
            res.json(JSON.parse(body));
        } else {
            res.sendStatus(response.statusCode);
        }
    });
};