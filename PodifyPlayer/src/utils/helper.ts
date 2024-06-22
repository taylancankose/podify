import {PermissionsAndroid, Platform} from 'react-native';

export const getImagePermissions = async () => {
  if (Platform.OS === 'android') {
    const permisionRes = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);

    console.log(permisionRes);
  }
};
