import { Router } from "express";

import ai from "./ai";

const router = Router();

export default (): Router => {
    ai(router);

    return router;
}