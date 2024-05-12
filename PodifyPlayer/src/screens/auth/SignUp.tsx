import React, {FC, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import colors from '@utils/colors';
import Form from '@components/form';
import {signupSchema} from '@utils/schemas';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import PasswordIcon from '@ui/PasswordIcon';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/form/AuthFormContainer';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface Props {}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <SafeAreaView style={styles.container}>
      <AuthFormContainer
        title="Welcome!"
        subtitle="Let's get started by creating your account.">
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
              secureTextEntry={secureEntry}
              containerStyle={styles.marginBottom}
              rightIcon={<PasswordIcon privateIcon={secureEntry} />}
              onRightIconPress={() => setSecureEntry(!secureEntry)}
            />
            <SubmitBtn title="Sign Up" />

            <View style={styles.linkContainer}>
              <AppLink
                title="Already have an account?"
                onPress={() => navigation.navigate('Sign in')}
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
    justifyContent: 'center',
    marginTop: 14,
  },
});

export default SignUp;
