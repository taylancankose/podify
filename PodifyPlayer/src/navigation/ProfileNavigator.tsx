import ProfileSettings from '@components/Profile/ProfileSettings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Profile from '@screens/Profile';
import Verification from '@screens/auth/Verification';
import colors from '@utils/colors';
import React, {FC} from 'react';

interface Props {}

const Stack = createNativeStackNavigator();

const ProfileNavigator: FC<Props> = props => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettings}
        options={{
          headerTitle: 'Settings',
          headerStyle: {
            backgroundColor: colors.PRIMARY,
          },
          headerTintColor: colors.CONTRAST,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        component={Verification}
        name="Verification"
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
