/**
 * Created by KOALA on 28/10/2016.
 */

import * as express from "express";
import {Settings} from "../../settings";

const request = require('request');
const crypto = require('crypto');

export = (req : express.Request, res : express.Response) => {
    let email: string = req.body.email;
    let password: string = req.body.password;

    request.get(Settings.SC_BASE_API_URL + '/auth/request_token?&app_id=11', function (error: any, response: any, body: any) {
        if (!error && response.statusCode == 200) {
            let requestToken = JSON.parse(body).request_token;
            let passMd5: string = crypto.createHash('md5').update(password).digest("hex");
            let nonce: string = crypto.createHmac('md5', requestToken.token).update(email + passMd5).digest('hex');
            let data = {
                token_id: requestToken.id,
                email: email,
                pass: password,
                nonce: nonce
            };
            request.post({url: Settings.SC_BASE_API_URL + '/auth/login', form: data}, function(error: any, response: any, body: any){
                if (!error && response.statusCode == 200) {
                    res.json(JSON.parse(body));
                } else {
                    res.sendStatus(401);
                }
            });
        } else {
            res.sendStatus(401);
        }
    });
};