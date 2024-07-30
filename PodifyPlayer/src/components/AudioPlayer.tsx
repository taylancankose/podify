import AppLink from '@ui/AppLink';
import AppModal from '@ui/AppModal';
import colors from '@utils/colors';
import React, {FC} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import {useProgress} from 'react-native-track-player';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/player';
import formatDuration = require('format-duration');
import Slider from '@react-native-community/slider';
import useAudioController from 'src/hooks/useAudioController';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import PlayerController from '@ui/PlayerController';
import Loader from '@ui/Loader';

interface Props {
  visible: boolean;
  onRequestClose(): void;
}

const formattedDuration = (duration = 0) => {
  return formatDuration(duration, {
    leading: true,
  });
};

const AudioPlayer: FC<Props> = ({visible, onRequestClose}) => {
  const {onGoingAudio} = useSelector(getPlayerState);
  const {
    seekTo,
    skipTo,
    skipNext,
    skipPrevious,
    togglePlayPause,
    isPlaying,
    isBusy,
  } = useAudioController();
  const poster = onGoingAudio?.poster;
  const source = poster ? {uri: poster} : require('../assets/music.png');

  const {duration, position} = useProgress();

  const updateSeek = async (value: number) => {
    await seekTo(value);
  };

  const handleSkipTo = async (skipType: 'forward' | 'reverse') => {
    if (skipType === 'forward') await skipTo(10);
    if (skipType === 'reverse') await skipTo(-10);
  };

  const handleNext = async () => {
    await skipNext(duration);
  };

  const handlePrev = async () => {
    await skipPrevious(duration);
  };

  return (
    <AppModal animation visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <Image source={source} style={styles.poster} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>
          <AppLink title={onGoingAudio?.owner?.name || ''} />

          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {formattedDuration(position * 1000)}
            </Text>
            <Text style={styles.duration}>
              {formattedDuration(duration * 1000)}
            </Text>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor={colors.CONTRAST}
            maximumTrackTintColor={colors.INACTIVE_CONTRAST}
            value={position}
            onSlidingComplete={updateSeek}
          />

          <View style={styles.controls}>
            <PlayerController ignoreContainer onPress={handlePrev}>
              <AntDesign
                name="stepbackward"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayerController>

            <PlayerController
              onPress={() => handleSkipTo('reverse')}
              ignoreContainer>
              <FontAwesome
                name="rotate-left"
                size={18}
                color={colors.CONTRAST}
              />
            </PlayerController>

            <PlayerController ignoreContainer={false}>
              {isBusy ? (
                <Loader />
              ) : (
                <PlayPauseBtn
                  playing={isPlaying}
                  color={colors.PRIMARY}
                  onPress={togglePlayPause}
                />
              )}
            </PlayerController>

            <PlayerController ignoreContainer>
              <FontAwesome
                name="rotate-right"
                size={18}
                color={colors.CONTRAST}
                onPress={() => handleSkipTo('forward')}
              />
            </PlayerController>

            <PlayerController ignoreContainer onPress={handleNext}>
              <AntDesign name="stepforward" size={24} color={colors.CONTRAST} />
            </PlayerController>
          </View>
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  poster: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.CONTRAST,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  duration: {
    color: colors.CONTRAST,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default AudioPlayer;
