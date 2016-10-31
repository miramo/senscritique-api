/**
 * Created by KOALA on 27/10/2016.
 */

import * as bodyParser from "body-parser";
import * as express from "express";

class Server {

    public app: express.Application;
    private nodePort: number;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor () {
        this.app = express();
        this.config();
        this.routes();
        this.onStart();
    }

    private config() {
        this.nodePort = process.env.PORT || 3000;
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private routes() {
        let routes = require("./routes");

        this.app.use("/", routes);
    }

    private onStart() {
        const server = this.app.listen(this.nodePort, () => {
            let host: string = server.address().address;
            let port: number = server.address().port;

            console.log(`http://${host}:${port}`);
        });
    }

}

let server = Server.bootstrap();
export = server.app;
