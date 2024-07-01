import TrackPlayer, {Event} from 'react-native-track-player';

const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {});
};

export default playbackService;
