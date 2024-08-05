import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '@screens/Home';
import PublicProfile from '@screens/PublicProfile';
import React, {FC} from 'react';
import {HomeNavigatorStackParamList} from 'src/@types/navigation';

interface Props {}

const Stack = createNativeStackNavigator<HomeNavigatorStackParamList>();

const HomeNavigator: FC<Props> = props => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="PublicProfile" component={PublicProfile} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
