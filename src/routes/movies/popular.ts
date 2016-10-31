/**
 * Created by KOALA on 29/10/2016.
 */

import * as express from "express";
import {Settings} from "../../settings";

const request = require("request");

export = (req: express.Request, res: express.Response) => {
    let headerToken = req.get(Settings.HEADER_TOKEN);

    request.get(Settings.SC_BASE_API_URL + `/products/popular?&access_token=${headerToken}&type_id=1`, function (error: any, response: any, body: any) {
        if (!error && response.statusCode === 200) {
            res.json(JSON.parse(body));
        } else {
            res.sendStatus(response.statusCode);
        }
    });
};