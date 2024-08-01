import deepEqual = require('deep-equal');
import {useEffect} from 'react';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
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

let isReady = false;

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
  const {onGoingAudio, onGoingList} = useSelector(getPlayerState);
  const dispatch = useDispatch();

  const isPlayerReady = playbackState !== State.None; // no equal to none check
  const isPlaying = playbackState === State.Playing;
  const isPaused = playbackState === State.Paused;
  const isBusy =
    playbackState === State.Buffering || playbackState === State.Loading;

  const onAudioPress = async (item: AudioData, data: AudioData[]) => {
    // loading and tapping first time
    if (!isPlayerReady) {
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

  const togglePlayPause = async () => {
    if (isPlaying) await TrackPlayer.pause();
    if (isPaused) await TrackPlayer.play();
  };

  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  const skipTo = async (sec: number) => {
    const currentPosition = await TrackPlayer.getProgress();
    await TrackPlayer.skipToNext(currentPosition.position + sec);
  };

  const skipNext = async (sec: number) => {
    const queue = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getActiveTrackIndex();
    if (queue === null) return;

    const nextIndex = currentIndex + 1;

    const nextAudio = queue[nextIndex];

    if (nextAudio) {
      await TrackPlayer.skipToNext();
      dispatch(updateOnGoingAudio(onGoingList[nextIndex]));
    }
  };

  const skipPrevious = async (sec: number) => {
    const queue = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getActiveTrackIndex();
    if (queue === null) return;

    const preIndex = currentIndex - 1;

    const preAudio = queue[preIndex];

    if (preAudio) {
      await TrackPlayer.skipToPrevious();
      dispatch(updateOnGoingAudio(onGoingList[preIndex]));
    }
  };

  const setPlaybackRate = async (rate: number) => {
    await TrackPlayer.setRate(rate);
  };

  useEffect(() => {
    const setupPlayer = async () => {
      if (isReady) return;
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 10,
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });
    };

    setupPlayer();
    isReady = true;
  }, []);

  return {
    onAudioPress,
    isPlayerReady,
    isPlaying,
    togglePlayPause,
    isBusy,
    seekTo,
    skipTo,
    skipNext,
    skipPrevious,
    setPlaybackRate,
  };
};

export default useAudioController;
