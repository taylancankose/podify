import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ForgotPassword from '@screens/auth/ForgotPassword';
import SignIn from '@screens/auth/SignIn';
import SignUp from '@screens/auth/SignUp';
import Verification from '@screens/auth/Verification';
import React from 'react';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Sign up" component={SignUp} />
      <Stack.Screen name="Forgot Password" component={ForgotPassword} />
      <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
