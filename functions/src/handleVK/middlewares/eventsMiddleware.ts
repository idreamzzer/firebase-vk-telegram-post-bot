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
    try {
      const vkGroupPostsRef = db.collection(
        `vkGroups/${context.group_id}/posts`
      );
      const snapshot = await vkGroupPostsRef
        .where("id", "==", context.object.id)
        .get();
      if (snapshot.empty) {
        await vkGroupPostsRef.add(context.object);
      } else {
        console.log("post duplication");
      }
    } catch (err) {
      console.error(err);
    }
    return res.send("ok");
  }
  next();
}

export default eventsMiddleware;
