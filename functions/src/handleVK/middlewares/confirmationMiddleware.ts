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
      const snapshot = await db
        .collection("vkGroups")
        .where("groupId", "==", context.group_id)
        .get();
      if (!snapshot.empty) {
        const vkGroup = snapshot.docs[0].data();
        return res.send(vkGroup.callbackString);
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
