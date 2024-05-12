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

const initialValues = {
  email: '',
  password: '',
};

interface Props {}

const SignIn: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <SafeAreaView style={styles.container}>
      <AuthFormContainer title="Welcome Back!">
        <Form
          initialValues={initialValues}
          onSubmit={values => {
            console.log(values);
          }}
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
