import React, {FC, useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import colors from '@utils/colors';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/form/AuthFormContainer';
import OTPField from '@ui/OTPField';
import AppButton from '@ui/AppButton';
import {ParamListBase, useNavigation, useRoute} from '@react-navigation/native';
import client from 'src/api/client';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import catchError from 'src/api/catchError';
import {updateNotification} from 'src/store/notification';
import {useDispatch} from 'react-redux';

interface Props {}

const otpFields = new Array(4).fill('');

const Verification: FC<Props> = props => {
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOTP, setActiveOTP] = useState(0);
  const [loading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState(30);
  const [canSendNewOTP, setCanSendNewOTP] = useState(false);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const inputRef = useRef<TextInput>(null);
  const filledOTPs = otp.filter(o => o !== '');

  const {userInfo} = route.params;

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

  const isValidOtp = otp.every(value => {
    return value.trim();
  });
  const handleSubmit = async () => {
    if (!isValidOtp)
      return dispatch(
        updateNotification({message: 'Invalid OTP', type: 'error'}),
      );
    setLoading(true);
    try {
      const {data} = await client.post('/auth/verify-email', {
        userId: userInfo.id,
        token: otp.join(''),
      });

      dispatch(updateNotification({message: data.message, type: 'success'}));

      navigation.navigate('SignIn');
    } catch (error) {
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
      console.log(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTP]);

  useEffect(() => {
    if (canSendNewOTP) return;

    const intervalId = setInterval(() => {
      setCountDown(old => {
        if (old <= 0) {
          setCanSendNewOTP(true);
          clearInterval(intervalId);
          return 0;
        }
        return old - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [canSendNewOTP]);

  const requestForOTP = async () => {
    try {
      await client.post('/auth/re-verify-email', {userId: userInfo.id});
      setCountDown(30);
      setCanSendNewOTP(false);
    } catch (error) {
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
      console.log('requestForOTP', error.message);
    }
  };
  console.log(filledOTPs)
  return (
    <SafeAreaView style={styles.container}>
      <AuthFormContainer title="Check your email">
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            {otpFields.map((_, i) => {
              return (
                <OTPField
                  style={{marginRight: 24}}
                  ref={activeOTP === i ? inputRef : null}
                  key={i}
                  placeholder="*"
                  onKeyPress={({nativeEvent}) => {
                    handleChange(nativeEvent.key, i);
                  }}
                  keyboardType="numeric"
                  textContentType="oneTimeCode"
                  maxLength={1}
                />
              );
            })}
          </View>

          <AppButton
            title="Verify"
            onPress={handleSubmit}
            disabled={filledOTPs.length < 3}
          />

          <View style={styles.linkContainer}>
            {countDown > 0 ? (
              <Text style={styles.countdown}>{countDown} sec</Text>
            ) : null}
            <AppLink
              loading={loading}
              title="Resend OTP"
              onPress={requestForOTP}
              active={canSendNewOTP}
            />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  countdown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});
export default Verification;
