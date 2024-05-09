import React, {FC} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import colors from '@utils/colors';
import Form from '@components/form';
import {forgetPasswordSchema} from '@utils/schemas';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/form/AuthFormContainer';

const initialValues = {
  email: '',
};

interface Props {}

const ForgotPassword: FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      <AuthFormContainer
        title="Forget Password"
        subtitle="Oops, did you forget your password? Don't worry, we'll help you to get back in.">
        <Form
          initialValues={initialValues}
          onSubmit={values => {
            console.log(values);
          }}
          validationSchema={forgetPasswordSchema}>
          <View style={styles.formContainer}>
            <AuthInputField
              name="email"
              placeholder="john@email.com"
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.marginBottom}
            />
            <SubmitBtn title="Send Link" />

            <View style={styles.linkContainer}>
              <AppLink title="Sign In" />
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
    justifyContent: 'center',
    marginTop: 14,
  },
});
export default ForgotPassword;
