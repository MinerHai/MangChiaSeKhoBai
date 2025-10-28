import { Request, Response, NextFunction } from "express";

export function checkApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey =
    req.query.api_key || req.header("Authorization")?.replace("Api-Key ", "");

  if (!apiKey) {
    return res.status(401).json({ message: "Missing API key" });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  next();
}
