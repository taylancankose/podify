import colors from '@utils/colors';
import React, {FC, useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import useAudioController from 'src/hooks/useAudioController';
import Loader from '@ui/Loader';
import {mapRange} from '@utils/math';
import {useProgress} from 'react-native-track-player';
import AudioPlayer from './AudioPlayer';

interface Props {}

export const MiniPlayerHeight = 60;

const MiniAudioPlayer: FC<Props> = props => {
  const [playerVisibility, setPlayerVisibility] = useState(false);
  const {onGoingAudio} = useSelector(getPlayerState);
  const {isPlaying, isBusy, togglePlayPause} = useAudioController();
  const progress = useProgress();

  const closePlayerModal = () => {
    setPlayerVisibility(false);
  };

  const showPlayerModal = () => {
    setPlayerVisibility(true);
  };

  const poster = onGoingAudio?.poster;
  const source = poster ? {uri: poster} : require('../assets/music.png');
  return (
    <>
      <View
        style={{
          height: 2,
          backgroundColor: colors.SECONDARY,
          width: `${mapRange({
            outputMin: 0,
            outputMax: 100,
            inputMin: 0,
            inputMax: progress.duration,
            inputValue: progress.position,
          })}%`,
        }}
      />
      <View style={styles.container}>
        <Image source={source} style={styles.poster} />

        <Pressable onPress={showPlayerModal} style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <Text style={styles.name}>{onGoingAudio?.owner.name}</Text>
        </Pressable>

        <Pressable style={{paddingHorizontal: 10}}>
          <AntDesign name="hearto" size={24} color={colors.CONTRAST} />
        </Pressable>
        {isBusy ? (
          <Loader />
        ) : (
          <PlayPauseBtn playing={isPlaying} onPress={togglePlayPause} />
        )}
      </View>

      <AudioPlayer
        visible={playerVisibility}
        onRequestClose={closePlayerModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: MiniPlayerHeight,
    backgroundColor: colors.PRIMARY,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    height: MiniPlayerHeight - 14,
    width: MiniPlayerHeight - 14,
    borderRadius: 5,
    marginVertical: 'auto',
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    padding: 5,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
  name: {
    color: colors.SECONDARY,
    fontWeight: '700',
    paddingHorizontal: 5,
  },
});

export default MiniAudioPlayer;
