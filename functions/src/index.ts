import * as functions from "firebase-functions";
import handleVKFunction from "./handleVK";
import sendPostFunction from "./sendPost";

export const handleVK = functions.https.onRequest(handleVKFunction());
export const sendPost = functions.firestore
  .document("groups/{groupId}/posts/{postId}")
  .onCreate(sendPostFunction);
