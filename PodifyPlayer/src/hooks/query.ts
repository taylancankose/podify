import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {AudioData, Playlist} from 'src/@types/audio';
import catchError from 'src/api/catchError';
import client, {getClient} from 'src/api/client';
import {updateNotification} from 'src/store/notification';

const getLatest = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();
  const query = useQuery(['latest-uploads'], {
    queryFn: () => getLatest(),
    onError(err) {
      const errMsg = catchError(err);
      dispatch(updateNotification({message: errMsg, type: 'error'}));
    },
  });

  return query;
};

const getRecommended = async (): Promise<AudioData[]> => {
  const {data} = await client('/profile/recommended');
  console.log(data);
  return data.audios;
};

export const usegetRecommendedAudios = () => {
  const dispatch = useDispatch();
  const query = useQuery(['recommended'], {
    queryFn: () => getRecommended(),
    onError(err) {
      const errMsg = catchError(err);
      dispatch(updateNotification({message: errMsg, type: 'error'}));
    },
  });
  return query;
};

const getPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
  const {data} = await client.get('/playlist/by-profile', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  return data.playlist;
};

export const useGetPlaylist = () => {
  const dispatch = useDispatch();
  const query = useQuery(['playlist'], {
    queryFn: () => getPlaylist(),
    onError(err) {
      const errMsg = catchError(err);
      dispatch(updateNotification({message: errMsg, type: 'error'}));
    },
  });

  return query;
};
