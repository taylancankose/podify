import React, {FC} from 'react';
import {
  Button,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '@utils/colors';
import AuthInputField from '@components/AuthInputField';
import {Formik} from 'formik';
import * as yup from 'yup';

const signupSchema = yup.object({
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

interface Props {}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          console.log(values);
        }}
        validationSchema={signupSchema}>
        {({handleSubmit, values, handleChange, errors}) => {
          return (
            <View style={styles.formContainer}>
              <AuthInputField
                placeholder="John Doe"
                label="Name"
                containerStyle={styles.marginBottom}
                onChange={handleChange('name')}
                value={values.name}
                errorMsg={errors?.name}
              />
              <AuthInputField
                placeholder="john@email.com"
                label="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.marginBottom}
                onChange={handleChange('email')}
                value={values.email}
                errorMsg={errors?.email}
              />
              <AuthInputField
                placeholder="********"
                label="Password"
                autoCapitalize="none"
                secureTextEntry
                onChange={handleChange('password')}
                value={values.password}
                errorMsg={errors?.password}
              />
              <Pressable style={styles.btn} onPress={() => handleSubmit()}>
                <Text style={styles.btnText}>Sign Up</Text>
              </Pressable>
            </View>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '85%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  btn: {
    marginTop: 14,
    backgroundColor: colors.SECONDARY,
    paddingHorizontal: 2,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  btnText: {
    color: colors.CONTRAST,
    fontWeight: '600',
  },
});

export default SignUp;
