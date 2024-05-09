import React, {FC, useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, View} from 'react-native';
import colors from '@utils/colors';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/form/AuthFormContainer';
import OTPField from '@ui/OTPField';
import AppButton from '@ui/AppButton';

interface Props {}

const otpFields = new Array(6).fill('');

const Verification: FC<Props> = props => {
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOTP, setActiveOTP] = useState(0);

  const inputRef = useRef<TextInput>(null);

  const handleChange = (value: string, i: number) => {
    const newOtp = [...otp];
    if (value === 'Backspace') {
      // moves to previous only if input field is empty
      if (!newOtp[i]) setActiveOTP(i - 1);
      newOtp[i] = '';
    } else {
      // update OTP move to next input field
      setActiveOTP(i + 1);
      newOtp[i] = value;
    }
    setOtp([...newOtp]);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTP]);

  return (
    <SafeAreaView style={styles.container}>
      <AuthFormContainer title="Check your email">
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            {otpFields.map((_, i) => {
              return (
                <OTPField
                  ref={activeOTP === i ? inputRef : null}
                  key={i}
                  placeholder="*"
                  onKeyPress={({nativeEvent}) => {
                    handleChange(nativeEvent.key, i);
                  }}
                />
              );
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
