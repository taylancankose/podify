import deepEqual = require('deep-equal');
import TrackPlayer, {
  State,
  Track,
  usePlaybackState,
} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import {
  getPlayerState,
  updateOnGoingAudio,
  updateOnGoingList,
} from 'src/store/player';

const updateQueue = async (data: AudioData[]) => {
  const lists: Track[] = data.map(item => {
    return {
      id: item.id,
      title: item.title,
      url: item.file,
      artist: item.owner.name,
      artwork: item.poster || require('../assets/music.png'),
      genre: item.category,
      isLiveStream: true,
    };
  });
  await TrackPlayer.add([...lists]);
};

const useAudioController = () => {
  const {state: playbackState} = usePlaybackState() as {state?: State};
  const {onGoingAudio} = useSelector(getPlayerState);
  const dispatch = useDispatch();

  const isPlayerReader = playbackState !== State.None; // no equal to none check
  console.log(playbackState);
  const onAudioPress = async (item: AudioData, data: AudioData[]) => {
    // loading and tapping first time
    if (!isPlayerReader) {
      // audio for first time
      await updateQueue(data);
      const index = data.findIndex(audio => audio.id === item.id);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      dispatch(updateOnGoingAudio(item));
      return dispatch(updateOnGoingList(data));
    }

    if (playbackState === State.Playing || onGoingAudio?.id === item.id) {
      // audio çalıyorsa tekrar bastığında durdur
      return await TrackPlayer.pause();
    }

    if (playbackState === State.Paused || onGoingAudio?.id === item.id) {
      // audio durduysa tekrar bastığında kaldığı yerden çal
      return await TrackPlayer.play();
    }

    // audio that pressing is not equal to on going audio (tapping another audio)
    if (onGoingAudio?.id !== item.id) {
      const fromSameList = deepEqual(onGoingAudio, data);
      await TrackPlayer.pause();
      const index = data.findIndex(audio => audio.id === item.id);

      if (!fromSameList) {
        // playing new audio from different list
        await TrackPlayer.reset();
        await updateQueue(data);
        dispatch(updateOnGoingList(data));
      }
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      dispatch(updateOnGoingAudio(item));
    }
  };

  return {onAudioPress};
};

export default useAudioController;
