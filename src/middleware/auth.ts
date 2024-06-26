import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import Jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("Error Auth");

    return res.sendStatus(401);
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = Jwt.decode(token) as Jwt.JwtPayload;

    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      console.log("Error no user");

      return res.sendStatus(401);
    }

    req.auth0Id = auth0Id as string;
    
    if(user._id !== null){
      req.userId = user._id.toString();
    }
    
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.sendStatus(401);
  }
};
