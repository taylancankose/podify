import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import catchError from 'src/api/catchError';
import client from 'src/api/client';
import {updateNotification} from 'src/store/notification';

const getLatest = async (): Promise<AudioData[]> => {
  const {data} = await client.get('/audio/latest');
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
