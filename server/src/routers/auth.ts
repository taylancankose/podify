import {
  create,
  generateForgetPasswordLink,
  grantValid,
  login,
  logout,
  sendProfile,
  sendReVerificationToken,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "#/controllers/auth";
import { isValidPasswordResetToken, mustAuth } from "#/middleware/auth";
import fileParser from "#/middleware/fileParser";
import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  LoginVerificationSchema,
  TokenAndIDValidation,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
  "/verify-password-reset-token",
  validate(TokenAndIDValidation),
  isValidPasswordResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPasswordResetToken,
  updatePassword
);
router.post("/login", validate(LoginVerificationSchema), login);
router.get("/is-auth", mustAuth, sendProfile);
router.post("/update-profile", mustAuth, fileParser, updateProfile);
router.post("/logout", mustAuth, logout);

router.get("/public", (req, res) => {
  res.json({
    message: "You are in public route",
  });
});
router.get("/private", mustAuth, (req, res) => {
  res.json({
    message: "You are in private route",
  });
});

export default router;

// to make validation in case there is no pw or email, we will use middleware
//  (req: any, res, next) => {
//  const { email, password, name } = req.body;
// if (!name.trim()) return res.json({ error: "Name is missing" });
// if (name.length < 3)
// return res.json({ error: "Name must be at least 4 characters" }); bunlar yerine yup kullanacağız

//next();
//}

{
  /*
LOKALDE DOSYA UPLOAD ETMEK İÇİN BU MIDDLEWARE

async (req, res) => {
  // content type multipart/form-data olmalı
  // handle the file upload (avatar gibi konular)
  // content type multipart/form-data değilse
  if (!req.headers["content-type"]?.startsWith("multipart/form-data"))
    return res.status(422).json({ error: "Only accept form-data" });

  const dir = path.join(__dirname, "../public/profiles");
  try {
    await fs.readdirSync(dir);
  } catch (error) {
    await fs.mkdirSync(dir);
  }
  const form = formidable({
    uploadDir: dir,
    filename(name, ext, part, form) {
      return Date.now() + "_" + part.originalFilename;
    },
  });
  form.parse(req, (err, fields, files) => {
    // bunun içinde yolluyoruz res.json'ı çünkü bu files ve fieldsı logladıktan sonra olmasını istiyoruz
    res.json({ uploaded: true });
  });
}
*/
}
