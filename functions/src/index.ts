import * as functions from "firebase-functions";
import handleVKFunction from "./handleVK";

export const handleVK = functions.https.onRequest(handleVKFunction());
