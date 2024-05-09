import passwordResetToken from "#/models/passwordResetToken";
import User from "#/models/user";
import { JWT_SECRET } from "#/utils/variables";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export const isValidPasswordResetToken: RequestHandler = async (
  req,
  res,
  next
) => {
  const { token, userId } = req.body;

  // validate token and userId
  const resetToken = await passwordResetToken.findOne({
    owner: userId,
  });
  if (!resetToken)
    return res
      .status(403)
      .json({ message: "Unauthorized access, invalid token" });

  const matched = await resetToken.compareToken(token);
  if (!matched)
    return res
      .status(403)
      .json({ message: "Unauthorized access, invalid token" });

  next();
};

export const mustAuth: RequestHandler = async (req, res, next) => {
  // tokeni extract ediyoruz
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];
  // check if there is a token
  if (!token) return res.status(403).json({ error: "Unauthorized request" });

  // verify the token
  const verifiedToken = verify(token, JWT_SECRET) as JwtPayload;
  const id = verifiedToken.userId;
  // find the user with id above
  const user = await User.findOne({ _id: id, tokens: token });
  // check if there is a user
  if (!user) return res.status(403).json({ message: "User not found" });

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers?.length,
    followings: user.followings?.length,
  };
  req.token = token;
  next();
};

export const isAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (token) {
    const payload = verify(token, JWT_SECRET) as JwtPayload;
    const id = payload.userId;

    const user = await User.findOne({ _id: id, tokens: token });
    if (!user) return res.status(403).json({ error: "Unauthorized request!" });

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    };
    req.token = token;
  }

  next();
};

export const isVerified: RequestHandler = (req, res, next) => {
  if (!req.user.verified)
    return res.status(403).json({ error: "Please verify your email address" });

  next();
};
