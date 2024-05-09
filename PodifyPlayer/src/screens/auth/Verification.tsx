import React, {FC} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import colors from '@utils/colors';
import SubmitBtn from '@components/form/SubmitBtn';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/form/AuthFormContainer';
import OTPField from '@ui/OTPField';
import AppButton from '@ui/AppButton';

interface Props {}

const otpFields = new Array(6).fill('');

const Verification: FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      <AuthFormContainer title="Check your email">
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            {otpFields.map((_, i) => {
              return <OTPField key={i} placeholder="*" />;
            })}
          </View>

          <AppButton title="Send Link" />

          <View style={styles.linkContainer}>
            <AppLink title="Resend OTP" />
          </View>
        </View>
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
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },
});
export default Verification;
