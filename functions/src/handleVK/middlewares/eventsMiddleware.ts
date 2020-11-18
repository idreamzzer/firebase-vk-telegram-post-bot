import express from "express";
import { db } from "../../api/firebase";

async function eventsMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> {
  console.log("events middleware");
  const context = req.body;
  if (context.type === "wall_post_new") {
    const wallPost = context.object;
    try {
      // Get group
      const groupSnap = await db
        .collection("groups")
        .doc(`${context.group_id}`)
        .get();

      // If group does not exist add new group
      if (!groupSnap.exists) {
        await db
          .collection("groups")
          .doc(`${context.group_id}`)
          .set({ groupId: context.group_id, callbackString: "" });
      }

      // Add new post in group
      await db
        .collection("groups")
        .doc(`${context.group_id}`)
        .collection("posts")
        .doc(`${wallPost.id}`)
        .set(wallPost);
    } catch (err) {
      console.error(err);
    }
    return res.send("ok");
  }
  next();
}

export default eventsMiddleware;
