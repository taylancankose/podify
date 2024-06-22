import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {UserProfile} from 'src/store/auth';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';

interface Props {
  profile?: UserProfile | null;
}

const ProfileContainer: FC<Props> = ({profile}) => {
  const navigation =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <AvatarField source={profile.avatar} />

        <View style={styles.infoContainer}>
          <View style={styles.flexRow}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <MaterialIcon name="verified" size={15} color={colors.SECONDARY} />
          </View>
          <Text style={styles.email}>{profile.email}</Text>

          <View style={styles.flexRow}>
            <Text style={styles.profileActionLink}>
              {profile.followers} Followers
            </Text>
            <Text style={styles.profileActionLink}>
              {profile.followings} Followings
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        style={styles.settingsBtn}
        onPress={() => navigation.navigate('ProfileSettings')}>
        <AntDesign name="setting" size={24} color={colors.CONTRAST} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    marginLeft: 8,
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 4,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    color: colors.SECONDARY,
  },
  profileActionLink: {
    backgroundColor: colors.SECONDARY,
    color: colors.PRIMARY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 5,
    fontWeight: '500',
  },
  settingsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileContainer;
