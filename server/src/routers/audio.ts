import {
  createAudio,
  getLatestUploads,
  updateAudio,
} from "#/controllers/audio";
import { isVerified, mustAuth } from "#/middleware/auth";
import fileParser from "#/middleware/fileParser";
import { validate } from "#/middleware/validator";
import { AudioVerificationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  mustAuth, // must logged in
  isVerified, // findout authed user is verified or not. verified email id users only upload audio....
  fileParser, // dosya kontrolü
  validate(AudioVerificationSchema), // audioVerficationSchema yı validate et
  createAudio
);

router.patch(
  "/:audioId",
  mustAuth, // must logged in
  isVerified, // findout authed user is verified or not. verified email id users only upload audio....
  fileParser, // dosya kontrolü
  validate(AudioVerificationSchema), // audioVerficationSchema yı validate et
  updateAudio
);

router.get("/latest", getLatestUploads);

export default router;
