import AudioForm from '@components/form/AudioForm';
import colors from '@utils/colors';
import {mapRange} from '@utils/math';
import React, {FC, useState} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import catchError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {updateNotification} from 'src/store/notification';

interface Props {}

const Upload: FC<Props> = props => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUpload = async (formData: FormData) => {
    setLoading(true);
    try {
      const client = await getClient({'Content-Type': 'multipart/form-data;'});
      const {data} = await client.post('/audio/create', formData, {
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
    } catch (error) {
      const errorMsg = catchError(error);
      dispatch(updateNotification({message: errorMsg, type: 'error'}));
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <AudioForm
      onSubmit={handleUpload}
      loading={loading}
      progress={uploadProgress}
    />
  );
};

const styles = StyleSheet.create({});

export default Upload;
