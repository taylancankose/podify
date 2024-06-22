import FavoriteTab from '@components/Profile/FavoriteTab';
import HistoryTab from '@components/Profile/HistoryTab';
import PlaylistTab from '@components/Profile/PlaylistTab';
import UploadTab from '@components/Profile/UploadTab';
import ProfileContainer from '@components/ProfileContainer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {getAuthState} from 'src/store/auth';

const Tab = createMaterialTopTabNavigator();

interface Props {}

const Profile: FC<Props> = props => {
  const {profile} = useSelector(getAuthState);
  return (
    <View style={styles.container}>
      <ProfileContainer profile={profile} />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarLabelStyle: styles.tabBarLabelStyle,
        }}>
        <Tab.Screen name="Uploads" component={UploadTab} />
        <Tab.Screen name="Playlists" component={PlaylistTab} />
        <Tab.Screen name="Favorites" component={FavoriteTab} />
        <Tab.Screen name="History" component={HistoryTab} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarStyle: {
    backgroundColor: 'transparent',
    elevation: 0,

    shadowRadius: 0,
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
  },
  tabBarLabelStyle: {
    color: colors.CONTRAST,
  },
});

export default Profile;
