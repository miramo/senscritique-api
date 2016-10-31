/**
 * Created by KOALA on 29/10/2016.
 */

import * as express from "express";
import {Settings} from "../../settings";
import {Utils} from "../../utils";

export = async function (req: express.Request, res: express.Response) {
    let headerToken = req.get(Settings.HEADER_TOKEN);

    await Utils.getSCProductsPopular(ProductTypes.Movie, headerToken).then((data: [boolean, any]) => {
        if (data == null)
            res.sendStatus(400);
        else if (data[0])
            res.json(data[1]);
        else if (!data[0])
            res.sendStatus(data[1]);
    });
};