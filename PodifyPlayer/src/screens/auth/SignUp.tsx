import React, {FC} from 'react';
import {Button, SafeAreaView, StyleSheet, View} from 'react-native';
import colors from '@utils/colors';
import AuthInputField from '@components/AuthInputField';

interface Props {}

const SignUp: FC<Props> = props => {
  const [userInfo, setUserInfo] = React.useState({
    name: '',
    email: '',
    password: '',
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <AuthInputField
          placeholder="John Doe"
          label="Name"
          containerStyle={styles.marginBottom}
          onChange={text =>
            setUserInfo({
              ...userInfo,
              name: text,
            })
          }
        />
        <AuthInputField
          placeholder="john@email.com"
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.marginBottom}
          onChange={text =>
            setUserInfo({
              ...userInfo,
              email: text,
            })
          }
        />
        <AuthInputField
          placeholder="********"
          label="Password"
          autoCapitalize="none"
          secureTextEntry
          onChange={text =>
            setUserInfo({
              ...userInfo,
              password: text,
            })
          }
        />
        <Button onPress={() => console.log(userInfo)} title="Sign Up" />
      </View>
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
});

export default SignUp;
