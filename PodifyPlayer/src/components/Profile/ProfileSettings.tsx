import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import React, {FC, useEffect, useState} from 'react';
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
import deepEqual = require('deep-equal');
import ImagePicker from 'react-native-image-crop-picker';
import {getImagePermissions} from '@utils/helper';
import ReVerificationLink from '@components/ReVerificationLink';

interface Props {}

interface ProfileInfo {
  name: string;
  avatar?: string;
}

const ProfileSettings: FC<Props> = props => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<ProfileInfo>({
    name: '',
  });

  const [loading, setLoading] = useState(false);
  const {profile} = useSelector(getAuthState);

  const isSame = deepEqual(userInfo, {
    name: profile?.name,
    avatar: profile?.avatar,
  });

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

  useEffect(() => {
    if (profile) setUserInfo({name: profile.name, avatar: profile.avatar});
  }, [profile]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!userInfo.name.trim())
        return dispatch(
          updateNotification({
            message: 'Profile name is required',
            type: 'error',
          }),
        );

      const formData = new FormData();
      formData.append('name', userInfo.name);
      if (userInfo.avatar) {
        formData.append('avatar', {
          name: 'avatar',
          type: 'image/jpeg',
          uri: userInfo.avatar,
        });
      }
      const client = await getClient({'Content-Type': 'multipart/form-data'});
      const {data} = await client.post('/auth/update-profile', formData);
      dispatch(updateProfile(data.profile));
      dispatch(
        updateNotification({message: 'Profile is updated', type: 'success'}),
      );
    } catch (error) {
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
    }
    setLoading(false);
  };

  const handleImageSelect = async () => {
    try {
      await getImagePermissions();
      const {path} = await ImagePicker.openPicker({
        cropping: true,
        width: 300,
        height: 300,
      });

      setUserInfo({
        ...userInfo,
        avatar: path,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Profile Settings</Text>
        </View>
        <View style={styles.settingsContainer}>
          <View style={styles.avatarContainer}>
            <AvatarField source={userInfo.avatar} />
            <Pressable onPress={handleImageSelect} style={styles.paddingLeft}>
              <Text style={styles.linkText}>Update Profile Image</Text>
            </Pressable>
          </View>
          <TextInput
            onChangeText={text => setUserInfo({...userInfo, name: text})}
            style={styles.nameInput}
            value={userInfo.name}
          />
          <View style={styles.emailContainer}>
            <Text style={styles.email}>{profile.email}</Text>
            {profile.verified ? (
              <MaterialIcon
                name="verified"
                size={15}
                color={colors.SECONDARY}
              />
            ) : (
              <ReVerificationLink linkTitle="Verify Account" activeAtFirst />
            )}
          </View>
        </View>
        {isSame ? null : (
          <View style={styles.marginTop}>
            <AppButton
              onPress={handleSubmit}
              title="Update"
              borderRadius={8}
              loading={loading}
            />
          </View>
        )}
      </View>

      <View style={{marginBottom: 10}}>
        <View>
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
