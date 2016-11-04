/**
 * Created by KOALA on 31/10/2016.
 */

import Settings from "./settings";
import * as rp from "request-promise";

export async function getSCProduct(id: number, headerToken: string): Promise<[boolean, any]> {
    let data: [boolean, any] = null;

    await rp(Settings.SC_BASE_API_URL + `/products/${id}?&access_token=${headerToken}`)
        .then(function (response: any) {
            data = [true, JSON.parse(response)];
        })
        .catch(function (error: any) {
            data = [false, error.statusCode];
        });

    return data;
}

export async function getSCProductsPopular(typeId: number, headerToken: string): Promise<[boolean, any]> {
    let data: [boolean, any] = null;

    await rp(Settings.SC_BASE_API_URL + `/products/popular?type_id=${typeId}&access_token=${headerToken}`)
        .then(function (response: any) {
            data = [true, JSON.parse(response)];
        })
        .catch(function (error: any) {
            data = [false, error.statusCode];
        });

    return data;
}
