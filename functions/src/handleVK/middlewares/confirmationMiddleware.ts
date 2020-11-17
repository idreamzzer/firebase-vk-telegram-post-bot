import express from "express";
import { db } from "../../api/firebase";

async function confirmationMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> {
  console.log("confirmation middleware");
  const context = req.body;
  if (context.type === "confirmation") {
    try {
      const vkGroupRef = db.collection("vkGroups").doc(`${context.group_id}`);
      const doc = await vkGroupRef.get();
      if (doc.exists) {
        return res.send(doc.data()?.callbackString);
      }
      return res.send("no callbackString found");
    } catch (err) {
      console.error(err);
      return res.send("something went wrong");
    }
  }
  return next();
}

export default confirmationMiddleware;
