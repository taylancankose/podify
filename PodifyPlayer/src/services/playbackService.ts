import TrackPlayer, {Event} from 'react-native-track-player';
import {getClient} from 'src/api/client';

const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async e => {
    const lists = await TrackPlayer.getQueue();
    const audio = lists[e.track];

    const client = await getClient();
    await client
      .post('/history', {
        audio: audio.id,
        progress: e.position,
        date: new Date(Date.now()),
      })
      .catch(err => console.log(err));
  });
};

export default playbackService;
