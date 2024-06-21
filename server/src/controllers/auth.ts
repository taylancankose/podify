import {
  sendForgetPasswordLink,
  sendPasswordResetSuccessEmail,
  sendVerificationMail,
} from "#/utils/mail";
import { formatProfile, generateToken } from "#/utils/helper";
import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import { RequestHandler } from "express";
import User from "#/models/user";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";
import emailVerificationToken from "#/models/emailVerificationToken";
import PasswordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";
import jwt from "jsonwebtoken";
import cloudinary from "#/cloud";
import formidable from "formidable";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser)
    return res.status(403).json({ error: "Email is already in use!" });

  const user = await User.create({ email, password, name });

  // SEND VERIFICATION EMAIL
  const token = generateToken(4);
  await emailVerificationToken.create({
    owner: user._id,
    token,
  });
  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  // owner olduğu için findOne yaptık
  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token" });

  if (!verificationToken)
    return res.status(403).json({ error: "Token is mismatched" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Successfully verified!" });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  // check first this userId is valid objectId in mongo
  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid Request" });

  // if there is this user existing in our mongo db
  const user = await User.findById(userId);

  if (!user) return res.status(403).json({ error: "Invalid Request" });

  if (user.verified)
    return res.status(422).json({ error: "Your account is already verified!" });

  // removing previous verification token if there is one already
  await EmailVerificationToken.findOneAndDelete({
    owner: userId,
  });

  // generate new verification token
  const token = generateToken(4);
  // store new verification token in mongo db
  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  // send mail this newToken
  sendVerificationMail(token, {
    name: user?.name,
    email: user?.email,
    userId: user?._id.toString(),
  });

  res.json({ message: "Please check your email" });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "Account not found!" });

  // generate the link
  // https://yourapp.com/reset-passwod?token=hfkshf4322hfjkds&userId=67jhfdsahf43

  await PasswordResetToken.findOneAndDelete({
    owner: user._id,
  });

  const token = crypto.randomBytes(36).toString("hex");
  await PasswordResetToken.create({
    owner: user._id,
    token: token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({ email: user.email, link: resetLink });

  res.json({ message: "Check you registered mail." });
};

export const grantValid: RequestHandler = (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  // userId den user'ı bul
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  // body deki password ile user modelindeki db de kayıtlı olan password aynı mı kontrol et
  const matched = await user.comparePassword(password);
  if (matched)
    return res
      .status(422)
      .json({ error: "The new password must be different than old one" });

  // password'ü body den gelen ile güncelle ve db de kaydet
  user.password = password;
  await user.save();

  // iş bitince tokeni sil
  await PasswordResetToken.findOneAndDelete({ owner: userId._id });

  // send success email
  sendPasswordResetSuccessEmail(user.name, user.email);

  res.json({ message: "Password reset successfully" });
};

export const login: RequestHandler = async (req, res) => {
  // body den pw ve emaili al
  const { password, email } = req.body;

  // email'den user'ı bul
  const user = await User.findOne({
    email,
  });
  // check if user exists
  if (!user) return res.status(403).json({ error: "Email/password not found" });

  // compare entered password with db
  const matched = await user.comparePassword(password);
  // check these PWs are matched
  if (!matched)
    return res.status(403).json({ error: "Password is not correct" });
  // asd
  // if matched, generate the token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  // {expiresIn: "10d", // tokenin expire süresi '30d' 30 gün, '1d' 1 gün});
  // 2. verilen şey random secret key
  user.tokens.push(token);

  // tokenleri update ettik bu user'ı save edelim
  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers?.length,
      followings: user.followings?.length,
    },
    token,
  });
};

export const updateProfile: RequestHandler = async (req, res) => {
  const { name } = req.body;
  const avatar = req.files?.avatar as formidable.File;

  const user = await User.findById(req.user.id);
  if (!user) throw new Error("something went wrong, user not found!");

  if (typeof name !== "string")
    return res.status(422).json({ error: "Invalid name!" });

  if (name.trim().length < 3)
    return res.status(422).json({ error: "Invalid name!" });

  user.name = name;

  if (avatar) {
    // if there is already an avatar file, we want to remove that
    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar?.publicId);
    }

    // upload new avatar file
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      avatar.filepath,
      {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      }
    );

    user.avatar = { url: secure_url, publicId: public_id };
  }

  await user.save();

  res.json({ profile: formatProfile(user) });
};

export const sendProfile: RequestHandler = (req, res) => {
  res.json({
    profile: req.user,
  });
};

export const logout: RequestHandler = async (req, res) => {
  // logout, logout from all
  // => "/auth/logout?fromAll=true" olursa tüm devicelardan çıkıcaz
  const { fromAll } = req.query;

  const token = req.token;
  const user = await User.findById(req.user.id);
  if (!user) throw new Error("Something went wrong, user not found");

  // logout from all
  if (fromAll === "yes") user.tokens = [];
  else user.tokens = user.tokens.filter((t) => t !== token);

  await user.save();

  res.json({ success: true });
};
