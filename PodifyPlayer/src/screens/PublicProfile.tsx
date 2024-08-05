import AppView from '@components/AppView';
import PublicPlaylistTab from '@components/Profile/PublicPlaylistTab';
import PublicProfileContainer from '@components/Profile/PublicProfileContainer';
import PublicUploadsTab from '@components/Profile/PublicUploadsTab';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  HomeNavigatorStackParamList,
  PublicProfileTabParamList,
} from 'src/@types/navigation';
import {useGetPublicProfile} from 'src/hooks/query';

type Props = NativeStackScreenProps<
  HomeNavigatorStackParamList,
  'PublicProfile'
>;

const Tab = createMaterialTopTabNavigator<PublicProfileTabParamList>();

const PublicProfile: FC<Props> = ({route}) => {
  const {profileId} = route.params;
  const {data} = useGetPublicProfile(profileId);

  return (
    <AppView>
      <View style={styles.container}>
        <PublicProfileContainer profile={data} />

        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}>
          <Tab.Screen
            name="PublicUploads"
            component={PublicUploadsTab}
            options={{
              tabBarLabel: 'Uploads',
            }}
            initialParams={{profileId}}
          />
          <Tab.Screen
            name="PublicPlaylist"
            component={PublicPlaylistTab}
            options={{
              tabBarLabel: 'Playlists',
            }}
            initialParams={{profileId}}
          />
        </Tab.Navigator>
      </View>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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

export default PublicProfile;
