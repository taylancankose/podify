import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import { categories } from "./audio_category";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing")
    .min(3, "Name must be at least 4 characters")
    .max(20, "Name is too long"),
  email: yup
    .string()
    .required("Email is missing")
    .email("Invalid email address"),
  password: yup
    .string()
    .trim()
    .required("You need to provide a password")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password is too long")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!" // pw nin nasıl olacağını belirtiyo bu karakterleri içermeli vs gibi
    ),
});

export const TokenAndIDValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid userId!"),
});

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid userId!"),
  password: yup
    .string()
    .trim()
    .required("You need to provide a password")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password is too long")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!" // pw nin nasıl olacağını belirtiyo bu karakterleri içermeli vs gibi
    ),
});

export const LoginVerificationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is missing")
    .email("Invalid email domain!"),
  password: yup.string().trim().required("You need to provide a password"),
});

export const AudioValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  about: yup.string().required("About is missing!"),
  category: yup
    .string()
    .oneOf(categories, "Invalid category!")
    .required("Category is missing!"),
});

export const NewPlaylistValidationSchema = yup.object().shape({
  // while creating playlist there can be request
  // with new playlist name and the audio that uesr wants to store inside that playlist
  // or user just want to create an empty playlist

  title: yup.string().required("Title is missing!"),
  resId: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }), // items içindeki id
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility must be public or private")
    .required("Visibility is missing!"),
});

export const OldPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  // this will validate the audio id
  item: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  // this is going to validate the playlist id
  id: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility must be public or private"),
});
