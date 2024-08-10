import express, { NextFunction, Response } from "express";
import router from "./api";

const application = express();
application.set("case sensitive routing", true);
application.set("etag", false);
application.set("strict routing", true);
application.set("x-powered-by", false);

application.use(express.json());

application.use("/api", router);

application.listen(parseInt(process.env.PORT ?? "8080"), "0.0.0.0", () => {
  console.log(`Backend Listening on 0.0.0.0:${process.env.PORT ?? 8080}`);
});
