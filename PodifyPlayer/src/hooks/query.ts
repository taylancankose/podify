import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {AudioData, History, Playlist} from 'src/@types/audio';
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
  const {data} = await client.get('/playlist/by-profile');
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

const getUploadsByProfile = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client.get('/profile/uploads');

  return data.audios;
};

export const useGetUploadsByProfile = () => {
  const dispatch = useDispatch();
  const query = useQuery(['uploads-by-profile'], {
    queryFn: () => getUploadsByProfile(),
    onError(err) {
      const errMsg = catchError(err);
      dispatch(updateNotification({message: errMsg, type: 'error'}));
    },
  });

  return query;
};

const getFavoritesByProfile = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client.get('/favorite');

  return data.audios;
};

export const useGetFavoritesByProfile = () => {
  const dispatch = useDispatch();
  const query = useQuery(['favorite'], {
    queryFn: () => getFavoritesByProfile(),
    onError(err) {
      const errMsg = catchError(err);
      dispatch(updateNotification({message: errMsg, type: 'error'}));
    },
  });

  return query;
};

const getHistory = async (): Promise<History[]> => {
  const client = await getClient();
  const {data} = await client.get('/history');

  return data.histories;
};

export const useGetHistory = () => {
  const dispatch = useDispatch();
  const query = useQuery(['histories'], {
    queryFn: () => getHistory(),
    onError(err) {
      const errMsg = catchError(err);
      dispatch(updateNotification({message: errMsg, type: 'error'}));
    },
  });

  return query;
};

const getRecentlyPlayed = async (): Promise<AudioData[]> => {
  const client = await getClient();
  const {data} = await client.get('/history/recently-played');

  return data.audios;
};

export const useGetRecentlyPlayed = () => {
  const dispatch = useDispatch();
  const query = useQuery(['recently-played'], {
    queryFn: () => getRecentlyPlayed(),
    onError(err) {
      const errMsg = catchError(err);
      dispatch(updateNotification({message: errMsg, type: 'error'}));
    },
  });

  return query;
};

const getRecommendedPlaylist = async (): Promise<Playlist[]> => {
  const client = await getClient();
  const {data} = await client.get('/profile/auto-generated-playlist');

  return data.playlist;
};

export const useGetRecommendedPlaylist = () => {
  const dispatch = useDispatch();
  const query = useQuery(['recommended-playlist'], {
    queryFn: () => getRecommendedPlaylist(),
    onError(err) {
      const errMsg = catchError(err);
      dispatch(updateNotification({message: errMsg, type: 'error'}));
    },
  });

  return query;
};

const getIsFav = async (id: string): Promise<boolean> => {
  const client = await getClient();
  const {data} = await client.get('/favorite/is-fav?audioId?=' + id);

  return data.result;
};

export const useGetIsFav = (id: string) => {
  const dispatch = useDispatch();
  const query = useQuery(['favorite', id], {
    queryFn: () => getIsFav(id),
    onError(err) {
      const errMsg = catchError(err);
      dispatch(updateNotification({message: errMsg, type: 'error'}));
    },
    enabled: id ? true : false,
  });

  return query;
};
