import React, {FC, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import colors from '@utils/colors';
import Form from '@components/form';
import {signinSchema} from '@utils/schemas';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import PasswordIcon from '@ui/PasswordIcon';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/form/AuthFormContainer';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import client from 'src/api/client';
import {FormikHelpers} from 'formik';
import {updateLoggedIn, updateProfile} from 'src/store/auth';
import {useDispatch} from 'react-redux';
import {Keys, saveToAsyncStorage} from '@utils/asyncStorage';
import catchError from 'src/api/catchError';
import {updateNotification} from 'src/store/notification';

const initialValues = {
  email: '',
  password: '',
};

interface newUser {
  email: string;
  password: string;
}

interface Props {}

const SignIn: FC<Props> = props => {
  const dispatch = useDispatch();
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleSubmit = async (values: newUser, actions) => {
    actions.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/login', values);
      console.log(data);
      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token);

      dispatch(updateProfile(data.profile));
      dispatch(updateLoggedIn(true));
    } catch (error) {
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
      console.log('Signin error:', error);
    }
    actions.setSubmitting(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AuthFormContainer title="Welcome Back!">
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={signinSchema}>
          <View style={styles.formContainer}>
            <AuthInputField
              name="email"
              placeholder="john@email.com"
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.marginBottom}
            />
            <AuthInputField
              name="password"
              placeholder="********"
              label="Password"
              autoCapitalize="none"
              secureTextEntry={secureEntry}
              containerStyle={styles.marginBottom}
              rightIcon={<PasswordIcon privateIcon={secureEntry} />}
              onRightIconPress={() => setSecureEntry(!secureEntry)}
            />
            <SubmitBtn title="Sign In" />

            <View style={styles.linkContainer}>
              <AppLink
                title="I forgot my password"
                onPress={() => navigation.navigate('Forgot Password')}
              />
              <AppLink
                title="Don't have an account?"
                onPress={() => navigation.navigate('Sign up')}
              />
            </View>
          </View>
        </Form>
      </AuthFormContainer>
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
    width: '100%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  linkContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
});
export default SignIn;
