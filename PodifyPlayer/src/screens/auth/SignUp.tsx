import React, {FC} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import colors from '@utils/colors';
import Form from '@components/form';
import {signupSchema} from '@utils/schemas';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';

interface Props {}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      <Form
        initialValues={initialValues}
        onSubmit={values => {
          console.log(values);
        }}
        validationSchema={signupSchema}>
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            placeholder="John Doe"
            label="Name"
            containerStyle={styles.marginBottom}
          />
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
            secureTextEntry
          />
          <SubmitBtn title="Sign Up" />
        </View>
      </Form>
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
    width: '90%',
  },
  marginBottom: {
    marginBottom: 20,
  },
});

export default SignUp;
