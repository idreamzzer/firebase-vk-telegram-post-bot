import express from "express";
import { WallAttachment, API, Attachment } from "vk-io";
// import { db } from "../../api/firebase";

async function eventsMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> {
  console.log("events middleware");
  const context = req.body;
  if (context.type === "wall_post_new") {
    console.log(context.object);
    const wallPost = new WallAttachment({
      api: new API({ token: "123" }),
      payload: context.object,
    });
    console.log(wallPost);
    res.send("ok");
    return;
  }
  next();
}

export default eventsMiddleware;
