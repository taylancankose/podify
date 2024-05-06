import { createPlaylist } from "#/controllers/playlist";
import { isVerified, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import { NewPlaylistValidationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  validate(NewPlaylistValidationSchema),
  createPlaylist
);

export default router;
