import { Router } from "express";

import { getData } from "@/controllers/ai";

export default (router: Router) => {
    router.post("/ai", getData);
};