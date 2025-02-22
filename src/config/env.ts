import dotenv from "dotenv";

dotenv.config();

const hfToken = process.env.HF_ACCESS_TOKEN;
const appPort = process.env.PORT;
const clientURL = process.env.CLIENT_URL?.split(',') ?? [];

export { hfToken, appPort, clientURL };