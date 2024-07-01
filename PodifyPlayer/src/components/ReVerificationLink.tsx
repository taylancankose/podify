import {NavigationProp, useNavigation} from '@react-navigation/native';
import AppLink from '@ui/AppLink';
import colors from '@utils/colors';
import React, {FC, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';
import catchError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {getAuthState} from 'src/store/auth';
import {updateNotification} from 'src/store/notification';

interface Props {
  time?: number;
  activeAtFirst?: boolean;
  linkTitle: string;
  userId?: string;
}

const ReVerificationLink: FC<Props> = ({
  time = 60,
  activeAtFirst = false,
  linkTitle,
  userId,
}) => {
  const [countDown, setCountDown] = useState(time);
  const [canSendNewOTP, setCanSendNewOTP] = useState(activeAtFirst);
  const {profile} = useSelector(getAuthState);

  const dispatch = useDispatch();
  const navigation =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const requestForOTP = async () => {
    setCountDown(60);
    setCanSendNewOTP(false);
    try {
      const client = await getClient();
      await client.post('/auth/re-verify-email', {
        userId: userId || profile?.id,
      });
      navigation.navigate('Verification', {
        userInfo: {
          email: profile?.email || '',
          name: profile?.name || '',
          id: userId || profile?.id || '',
        },
      });
    } catch (error) {
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
      console.log('requestForOTP', error.message);
    }
  };

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

  return (
    <View style={styles.linkContainer}>
      {countDown > 0 && !canSendNewOTP ? (
        <Text style={styles.countdown}>{countDown} sec</Text>
      ) : null}
      <AppLink
        title={linkTitle}
        onPress={requestForOTP}
        active={canSendNewOTP}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});

export default ReVerificationLink;
