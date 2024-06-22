import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, Pressable, TextInput} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppButton from '@ui/AppButton';
import {getClient} from 'src/api/client';
import catchError from 'src/api/catchError';
import {useDispatch, useSelector} from 'react-redux';
import {updateNotification} from 'src/store/notification';
import {Keys, removeFromAsyncStorage} from '@utils/asyncStorage';
import {
  getAuthState,
  updateLoading,
  updateLoggedIn,
  updateProfile,
} from 'src/store/auth';
import {useNavigation} from '@react-navigation/native';

interface Props {}

const ProfileSettings: FC<Props> = props => {
  const dispatch = useDispatch();
  const authState = useSelector(getAuthState);
  console.log(authState);
  const handleLogout = async (fromAll?: boolean) => {
    dispatch(updateLoading(true));
    try {
      const endpoint = `/auth/logout?fromAll=${fromAll ? 'yes' : ''}`;

      const client = await getClient();
      await client.post(endpoint);
      await removeFromAsyncStorage(Keys.AUTH_TOKEN);
      dispatch(updateProfile(null));
      dispatch(updateLoggedIn(false));
    } catch (error) {
      const errMsg = catchError(error);
      dispatch(updateNotification({message: errMsg, type: 'error'}));
    }
    dispatch(updateLoading(false));
  };
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Profile Settings</Text>
        </View>
        <View style={styles.settingsContainer}>
          <View style={styles.avatarContainer}>
            <AvatarField />
            <Pressable style={styles.paddingLeft}>
              <Text style={styles.linkText}>Update Profile Image</Text>
            </Pressable>
          </View>
          <TextInput style={styles.nameInput} value="John" />
          <View style={styles.emailContainer}>
            <Text style={styles.email}>john@email.com</Text>
            <MaterialIcon name="verified" size={15} color={colors.SECONDARY} />
          </View>
        </View>
      </View>

      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.logout}>Logout</Text>
        </View>
        <View style={styles.settingsContainer}>
          <Pressable
            onPress={() => handleLogout(true)}
            style={styles.logoutBtn}>
            <AntDesign name="logout" size={24} color={colors.CONTRAST} />
            <Text style={styles.logoutBtnTitle}>Logout From All</Text>
          </Pressable>

          <Pressable onPress={() => handleLogout()} style={styles.logoutBtn}>
            <AntDesign name="logout" size={24} color={colors.CONTRAST} />
            <Text style={styles.logoutBtnTitle}>Logout</Text>
          </Pressable>
        </View>

        <View style={styles.marginTop}>
          <AppButton title="Update" borderRadius={8} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1,
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.SECONDARY,
    paddingBottom: 5,
    marginTop: 5,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: colors.SECONDARY,
  },
  settingsContainer: {
    marginTop: 16,
    paddingLeft: 16,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: colors.SECONDARY,
  },
  nameInput: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 14,
    padding: 10,
    borderWidth: 0.6,
    borderColor: colors.CONTRAST,
    borderRadius: 8,
    marginVertical: 16,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 10,
  },
  logout: {
    fontSize: 16,
    color: colors.INACTIVE_CONTRAST,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: colors.OVERLAY,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  logoutBtnTitle: {
    marginLeft: 10,
    color: colors.CONTRAST,
    fontSize: 14,
  },
  paddingLeft: {
    paddingLeft: 16,
  },
  marginTop: {
    marginTop: 16,
  },
});

export default ProfileSettings;
