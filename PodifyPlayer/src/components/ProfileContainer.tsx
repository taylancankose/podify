import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {UserProfile} from 'src/store/auth';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  profile?: UserProfile | null;
}

const ProfileContainer: FC<Props> = ({profile}) => {
  if (!profile) return null;

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
    color: colors.CONTRAST,
  },
  profileActionLink: {
    backgroundColor: colors.SECONDARY,
    color: colors.PRIMARY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 5,
  },
});

export default ProfileContainer;
