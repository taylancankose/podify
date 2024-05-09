import * as yup from 'yup';

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
