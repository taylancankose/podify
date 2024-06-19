import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import React, {FC, useEffect} from 'react';
import AuthNavigator from './AuthNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAuthState,
  updateLoading,
  updateLoggedIn,
  updateProfile,
} from 'src/store/auth';
import AppNavigator from './AppNavigator';
import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import client from 'src/api/client';
import Loader from '@ui/Loader';
import {View, StyleSheet} from 'react-native';
import colors from '@utils/colors';

interface Props {}

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.PRIMARY,
    primary: colors.CONTRAST,
  },
};

const Navigator: FC<Props> = props => {
  const {loggedIn, loading} = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAuthStatus = async () => {
      dispatch(updateLoading(true));
      try {
        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

        if (!token) {
          dispatch(updateLoading(false));
          return;
        }

        const {data} = await client.get('/auth/is-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(updateProfile(data.profile));
        dispatch(updateLoggedIn(true));
      } catch (error) {
        console.log(error, 'auth error');
      }
      dispatch(updateLoading(false));
    };
    getAuthStatus();
  }, []);

  return (
    <NavigationContainer theme={AppTheme}>
      {loggedIn ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default Navigator;
