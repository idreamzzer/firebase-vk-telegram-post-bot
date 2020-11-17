import express from "express";
import config from "../../config";

async function secretMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> {
  console.log("secret middleware");
  const context = req.body;
  if (!context.secret) {
    return res.send("no secret provided");
  }
  if (config.bots.some((bot) => bot.vk.secret === context.secret))
    return next();
  return res.send("wrong secret");
}

export default secretMiddleware;
