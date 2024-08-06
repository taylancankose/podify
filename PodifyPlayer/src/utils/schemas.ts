import * as yup from 'yup';
import {categories} from './audio_category';

export const signupSchema = yup.object({
  name: yup
    .string()
    .trim('Name is missing')
    .min(3, 'Name should be minimum 3 characters')
    .required('Name is required'),
  email: yup
    .string()
    .trim('Email is missing')
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .trim('Password is missing')
    .min(8, 'Password should be at least 8 characters')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      'Password is too simple!',
    )
    .required('Password is required'),
});

export const signinSchema = yup.object({
  email: yup
    .string()
    .trim('Email is missing')
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .trim('Password is missing')
    .min(8, 'Password should be at least 8 characters')
    .required('Password is required'),
});

export const forgetPasswordSchema = yup.object({
  password: yup
    .string()
    .trim('Password is missing')
    .min(8, 'Password should be at least 8 characters')
    .required('Password is required'),
});

export const commonSchema = yup.object().shape({
  title: yup.string().trim().required('Title is missing'),
  category: yup.string().oneOf(categories).required('Category is missing'),
  about: yup.string().trim().required('About is missing'),

  poster: yup.object().shape({
    uri: yup.string(),
    name: yup.string(),
    type: yup.string(),
    size: yup.number(),
  }),
});

export const newAudioSchema = yup.object().shape({
  ...commonSchema.fields,
  file: yup.object().shape({
    uri: yup.string().required('Audio file is missing!'),
    name: yup.string().required('Audio file is missing!'),
    type: yup.string().required('Audio file is missing!'),
    size: yup.number().required('Audio file is missing!'),
  }),
});

export const oldAudioSchema = yup.object().shape({
  ...commonSchema.fields,
});
