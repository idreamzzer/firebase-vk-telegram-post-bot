// import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// import { db } from "../api/firebase";
import {
  confirmationMiddleware,
  eventsMiddleware,
  secretMiddleware,
} from "./middlewares";

function handleVK(): express.Application {
  const app: express.Application = express();
  app.use(cors({ origin: true }));
  app.use(bodyParser.json());
  app.use(secretMiddleware);
  app.use(confirmationMiddleware);
  app.use(eventsMiddleware);
  return app;
}

export default handleVK;
