import AudioForm from '@components/form/AudioForm';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {mapRange} from '@utils/math';
import React, {FC, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';
import catchError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {updateNotification} from 'src/store/notification';

type Props = NativeStackScreenProps<
  ProfileNavigatorStackParamList,
  'UpdateAudio'
>;

const UpdateAudio: FC<Props> = props => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const {audio} = props.route.params;

  const handleUpdate = async (formData: FormData) => {
    setLoading(true);
    try {
      const client = await getClient({'Content-Type': 'multipart/form-data;'});
      const {data} = await client.patch(`/audio/${audio?.id}`, formData, {
        onUploadProgress(progressEvent) {
          const uploaded = mapRange({
            inputMin: 0,
            inputMax: progressEvent.total || 0,
            outputMin: 0,
            outputMax: 100,
            inputValue: progressEvent.loaded,
          });

          if (uploaded >= 100) {
            setLoading(false);
          }

          setUploadProgress(Math.floor(uploaded));
        },
      });

      queryClient.invalidateQueries({queryKey: ['uploads-by-profile']});
      navigation.navigate('Profile');
    } catch (error) {
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <AudioForm
      initialValues={{
        title: audio?.title,
        category: audio?.category,
        about: audio?.about,
      }}
      onSubmit={handleUpdate}
      loading={loading}
      progress={uploadProgress}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default UpdateAudio;
